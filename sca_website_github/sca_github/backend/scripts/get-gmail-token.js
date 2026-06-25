'use strict';

/**
 * One-time helper to obtain a Gmail API **refresh token** for sending mail.
 *
 * Prerequisites (Google Cloud Console, ~5 min — see SETUP notes printed below):
 *   1. Create/select a project, enable the "Gmail API".
 *   2. Configure the OAuth consent screen (External), add your sending Gmail
 *      address as a Test user, and add scope .../auth/gmail.send.
 *   3. Create an OAuth client of type "Desktop app".
 *   4. Put its Client ID / Secret in the repo-root .env as
 *      GMAIL_CLIENT_ID / GMAIL_CLIENT_SECRET.
 *
 * Then run:  node backend/scripts/get-gmail-token.js
 * It opens a consent URL, you approve as the sending account, and it prints the
 * GMAIL_REFRESH_TOKEN to paste into .env (and Render).
 */

const http = require('http');
const path = require('path');
const { URL } = require('url');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const PORT = 5055;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;
const SCOPE = 'https://www.googleapis.com/auth/gmail.send';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('\nMissing GMAIL_CLIENT_ID / GMAIL_CLIENT_SECRET in .env.');
  console.error('Create a "Desktop app" OAuth client in Google Cloud Console and add them first.\n');
  process.exit(1);
}

const authUrl =
  'https://accounts.google.com/o/oauth2/v2/auth?' +
  new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: SCOPE,
    access_type: 'offline',
    prompt: 'consent', // force a refresh_token every time
  }).toString();

async function exchangeCode(code) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Token exchange failed: ${JSON.stringify(json)}`);
  return json;
}

const server = http.createServer(async (req, res) => {
  if (!req.url.startsWith('/oauth2callback')) {
    res.writeHead(404).end();
    return;
  }
  const code = new URL(req.url, REDIRECT_URI).searchParams.get('code');
  if (!code) {
    res.writeHead(400).end('No authorization code received.');
    return;
  }
  try {
    const tokens = await exchangeCode(code);
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end('<h2>Success!</h2><p>Refresh token captured. Return to your terminal.</p>');
    console.log('\n==================== COPY THIS ====================');
    console.log('GMAIL_REFRESH_TOKEN=' + tokens.refresh_token);
    console.log('==================================================');
    if (!tokens.refresh_token) {
      console.log('\n(No refresh_token returned — revoke prior access at');
      console.log(' https://myaccount.google.com/permissions and re-run.)');
    }
    console.log('\nPaste it into .env and into Render Environment, then restart.\n');
  } catch (err) {
    res.writeHead(500).end('Error: ' + err.message);
    console.error(err.message);
  } finally {
    setTimeout(() => server.close(() => process.exit(0)), 500);
  }
});

server.listen(PORT, () => {
  console.log('\nOpen this URL in your browser and approve as your SENDING Gmail account:\n');
  console.log(authUrl + '\n');
  console.log(`Waiting for the redirect on ${REDIRECT_URI} ...`);
});
