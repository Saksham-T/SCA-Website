'use strict';

/**
 * Gmail API mailer (OAuth2, no SMTP).
 *
 * Sends email from your own Google account via the Gmail REST API over
 * HTTPS:443 — so it works on hosts that block outbound SMTP (e.g. Render), and
 * no third-party relay ever handles the message. The "From" is your real Gmail
 * address, authenticated by Google itself.
 *
 * Auth: a long-lived OAuth2 refresh token (obtained once) is exchanged for a
 * short-lived access token on demand and cached until shortly before it expires.
 *
 * Requires config.mail.gmail: { clientId, clientSecret, refreshToken, sender }.
 * Docs: https://developers.google.com/gmail/api/reference/rest/v1/users.messages/send
 */

const https = require('https');
const fs = require('fs').promises;
const path = require('path');
const MailComposer = require('nodemailer/lib/mail-composer');
const config = require('../config');

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SEND_URL = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';

let cachedToken = null; // { accessToken, expiresAt (epoch ms) }

/** POST application/x-www-form-urlencoded and resolve parsed JSON (2xx) or reject. */
function postForm(url, form) {
  const body = new URLSearchParams(form).toString();
  return request(url, { 'content-type': 'application/x-www-form-urlencoded' }, body);
}

/** Low-level HTTPS request returning parsed JSON on 2xx, else rejecting. */
function request(url, headers, body) {
  const u = new URL(url);
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        host: u.host,
        path: u.pathname + u.search,
        method: 'POST',
        family: 4, // Render has no outbound IPv6 route
        headers: { ...headers, 'content-length': Buffer.byteLength(body) },
        timeout: config.mail.timeoutMs,
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(data || '{}'));
            } catch (e) {
              reject(new Error(`Gmail API: bad JSON (${res.statusCode})`));
            }
          } else {
            reject(new Error(`Gmail API ${res.statusCode}: ${data}`));
          }
        });
      }
    );
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('Gmail API request timed out')));
    req.write(body);
    req.end();
  });
}

/** Get a valid access token, refreshing via the refresh token when needed. */
async function getAccessToken() {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt - 60000 > now) {
    return cachedToken.accessToken;
  }
  const { clientId, clientSecret, refreshToken } = config.mail.gmail;
  const json = await postForm(TOKEN_URL, {
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });
  cachedToken = {
    accessToken: json.access_token,
    expiresAt: now + (json.expires_in || 3600) * 1000,
  };
  return cachedToken.accessToken;
}

/** Normalise nodemailer-style attachments, reading file paths into buffers. */
async function resolveAttachments(attachments = []) {
  const out = [];
  for (const att of attachments) {
    if (att.content) {
      out.push({ filename: att.filename, content: att.content, contentType: att.contentType });
    } else if (att.path) {
      out.push({
        filename: att.filename || path.basename(att.path),
        content: await fs.readFile(att.path),
        contentType: att.contentType,
      });
    }
  }
  return out;
}

/** Build a base64url-encoded RFC822 message for the Gmail API. */
async function buildRawMessage(msg) {
  const mail = new MailComposer({
    from: msg.from,
    to: msg.to,
    replyTo: msg.replyTo,
    subject: msg.subject,
    html: msg.html,
    attachments: await resolveAttachments(msg.attachments),
  });
  const mime = await mail.compile().build();
  return mime.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Send an email via the Gmail API.
 * @param {object} msg  nodemailer-style ({ from, to, replyTo, subject, html, attachments }).
 */
async function sendMail(msg) {
  const accessToken = await getAccessToken();
  const raw = await buildRawMessage(msg);
  const result = await request(
    SEND_URL,
    { authorization: `Bearer ${accessToken}`, 'content-type': 'application/json' },
    JSON.stringify({ raw })
  );
  return { messageId: result.id, threadId: result.threadId };
}

/** Readiness check: confirm we can mint an access token from the refresh token. */
async function verify() {
  const { clientId, clientSecret, refreshToken } = config.mail.gmail;
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Gmail API not fully configured (need client id, secret, refresh token)');
  }
  await getAccessToken();
  return true;
}

module.exports = { sendMail, verify };
