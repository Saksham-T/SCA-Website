'use strict';

/**
 * Brevo (formerly Sendinblue) transactional email over the HTTP API.
 *
 * Used instead of SMTP on hosts that block outbound SMTP ports (e.g. Render).
 * All traffic goes over HTTPS:443, which cloud providers do not block.
 *
 * Docs: https://developers.brevo.com/reference/sendtransacemail
 */

const https = require('https');
const fs = require('fs').promises;
const path = require('path');
const config = require('../config');

const BREVO_HOST = 'api.brevo.com';
const BREVO_PATH = '/v3/smtp/email';

/**
 * Parse an RFC-5322-ish address string into { name, email }.
 * Accepts: `"Display Name <a@b.com>"`, `Display Name <a@b.com>`, or `a@b.com`.
 */
function parseAddress(input) {
  if (!input) return null;
  const match = String(input).match(/^\s*"?([^"<]*?)"?\s*<\s*([^>]+)\s*>\s*$/);
  if (match) return { name: match[1].trim(), email: match[2].trim() };
  return { email: String(input).trim() };
}

/** Convert nodemailer-style attachments to Brevo's { name, content } (base64). */
async function buildAttachments(attachments = []) {
  const out = [];
  for (const att of attachments) {
    let base64;
    if (att.content) {
      base64 = Buffer.isBuffer(att.content)
        ? att.content.toString('base64')
        : Buffer.from(att.content).toString('base64');
    } else if (att.path) {
      base64 = (await fs.readFile(att.path)).toString('base64');
    } else {
      continue;
    }
    out.push({ name: att.filename || path.basename(att.path || 'attachment'), content: base64 });
  }
  return out;
}

/** Low-level HTTPS POST to the Brevo API. Resolves on 2xx, rejects otherwise. */
function postToBrevo(payload) {
  const body = JSON.stringify(payload);
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        host: BREVO_HOST,
        path: BREVO_PATH,
        method: 'POST',
        family: 4, // Render has no outbound IPv6 route
        headers: {
          'api-key': config.mail.brevoApiKey,
          'content-type': 'application/json',
          accept: 'application/json',
          'content-length': Buffer.byteLength(body),
        },
        timeout: config.mail.timeoutMs,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            let messageId;
            try {
              messageId = JSON.parse(data).messageId;
            } catch (_) {
              /* non-JSON 2xx — fine */
            }
            return resolve({ messageId, statusCode: res.statusCode });
          }
          reject(new Error(`Brevo API ${res.statusCode}: ${data}`));
        });
      }
    );
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('Brevo request timed out')));
    req.write(body);
    req.end();
  });
}

/**
 * Send an email via Brevo.
 * @param {object} msg
 * @param {string} msg.from     "Name <email>" or "email"
 * @param {string} msg.to       recipient email
 * @param {string} [msg.replyTo]
 * @param {string} msg.subject
 * @param {string} msg.html
 * @param {Array}  [msg.attachments]  nodemailer-style attachments
 */
async function sendMail(msg) {
  const sender = parseAddress(msg.from);
  const replyTo = parseAddress(msg.replyTo);
  const attachment = await buildAttachments(msg.attachments);

  const payload = {
    sender,
    to: [{ email: msg.to }],
    subject: msg.subject,
    htmlContent: msg.html,
  };
  if (replyTo) payload.replyTo = replyTo;
  if (attachment.length) payload.attachment = attachment;

  return postToBrevo(payload);
}

/** Lightweight readiness check (no API "verify" endpoint; just confirm key). */
async function verify() {
  if (!config.mail.brevoApiKey) throw new Error('BREVO_API_KEY is not set');
  return true;
}

module.exports = { sendMail, verify, parseAddress };
