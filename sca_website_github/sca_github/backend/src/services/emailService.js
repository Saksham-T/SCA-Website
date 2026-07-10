'use strict';

/**
 * Email service.
 *
 * Two delivery providers are supported behind a single `deliver()` call:
 *   - Brevo HTTP API (preferred) — used when BREVO_API_KEY is set. Sends over
 *     HTTPS:443, which works on hosts that block outbound SMTP (e.g. Render).
 *   - SMTP via Nodemailer (fallback) — used for local dev / when no API key.
 *
 * The service exposes high-level operations used by the application workflow:
 * notifying HR (with the resume attached) and acknowledging the candidate.
 */

const dns = require('dns').promises;
const nodemailer = require('nodemailer');
const config = require('../config');
const logger = require('../config/logger');
const templates = require('../utils/emailTemplates');
const brevoMailer = require('./brevoMailer');

const useBrevo = Boolean(config.mail.brevoApiKey);

const isConfigured =
  useBrevo ||
  (config.mail.host &&
    config.mail.user &&
    config.mail.pass &&
    !config.mail.pass.includes('placeholder') &&
    !config.mail.pass.includes('your-smtp'));

/**
 * Provider-agnostic send. Routes to Brevo (HTTP) or SMTP depending on config.
 * @param {object} msg  nodemailer-style message ({ from, to, replyTo, subject, html, attachments }).
 */
async function deliver(msg) {
  if (useBrevo) {
    return brevoMailer.sendMail(msg);
  }
  const transporter = await getTransporter();
  return transporter.sendMail(msg);
}

/**
 * Build the SMTP transporter, dialing the host's IPv4 address directly.
 *
 * Render has no outbound IPv6 route, but Gmail's SMTP host resolves to an
 * AAAA (IPv6) record first -> "connect ENETUNREACH <ipv6>". We resolve the A
 * (IPv4) record ourselves and connect to that IP, keeping `tls.servername` set
 * to the original hostname so certificate validation still succeeds.
 *
 * The transporter is built once and cached (as a promise) so the DNS lookup
 * happens a single time.
 */
let transporterPromise = null;

async function buildTransporter() {
  let host = config.mail.host;
  try {
    const { address } = await dns.lookup(config.mail.host, { family: 4 });
    host = address; // dial the IPv4 address directly
    logger.info(`SMTP resolved ${config.mail.host} -> ${address} (IPv4)`);
  } catch (err) {
    logger.warn(`SMTP IPv4 resolution failed for ${config.mail.host}: ${err.message}. Falling back to hostname.`);
  }

  return nodemailer.createTransport({
    host,
    port: config.mail.port,
    secure: config.mail.secure,
    auth: { user: config.mail.user, pass: config.mail.pass },
    family: 4, // belt-and-suspenders: never attempt IPv6
    tls: { servername: config.mail.host }, // cert is for the hostname, not the IP
    connectionTimeout: config.mail.timeoutMs, // cloud->SMTP handshakes can be slow
    greetingTimeout: config.mail.timeoutMs,
    socketTimeout: config.mail.timeoutMs,
  });
}

/** Lazily create and cache the transporter. */
function getTransporter() {
  if (!transporterPromise) transporterPromise = buildTransporter();
  return transporterPromise;
}

/** Verify the active mail provider at startup; logs but does not crash the app. */
async function verifyTransport() {
  if (!isConfigured) {
    logger.warn('Email is not configured (no Brevo key and no SMTP creds). Email sending is mocked.');
    return;
  }
  if (useBrevo) {
    try {
      await brevoMailer.verify();
      logger.info('Email provider ready: Brevo HTTP API.');
    } catch (err) {
      logger.error(`Brevo readiness check failed: ${err.message}`);
    }
    return;
  }
  try {
    const transporter = await getTransporter();
    await transporter.verify();
    logger.info('SMTP transport verified and ready. [ipv4-direct build]');
  } catch (err) {
    logger.error(`SMTP verification failed [ipv4-direct build]: ${err.message}`);
  }
}

/**
 * Send the HR notification email with the candidate resume attached.
 * @param {object} app  Stored application (plain object).
 */
async function sendHrNotification(app) {
  if (!isConfigured) {
    logger.info(`[MOCK EMAIL] HR notification for candidate ${app.fullName} (${app.position}) - resume: ${app.resume?.originalName}`);
    return;
  }
  const subject = `New application: ${app.fullName} — ${app.position}`;
  await deliver({
    from: config.mail.from,
    to: config.mail.hrEmail,
    replyTo: `"${app.fullName}" <${app.email}>`,
    subject,
    html: templates.hrNotification(app),
    attachments: [
      {
        filename: app.resume.originalName,
        path: app.resume.path,
        contentType: app.resume.mimeType,
      },
    ],
  });
  logger.info(`HR notification sent for ${app.submissionId}`);
}

/**
 * Send the branded acknowledgement email to the candidate.
 * @param {object} app  Stored application (plain object).
 */
async function sendCandidateAcknowledgement(app) {
  if (!isConfigured) {
    logger.info(`[MOCK EMAIL] Candidate acknowledgement for ${app.fullName} <${app.email}>`);
    return;
  }
  await deliver({
    from: config.mail.from,
    to: app.email,
    subject: `We've received your application | ${config.mail.companyName}`,
    html: templates.candidateAcknowledgement(app),
  });
  logger.info(`Candidate acknowledgement sent for ${app.submissionId}`);
}

/**
 * Send a project inquiry brief notification email to the general inbox.
 * @param {object} inquiry  Stored inquiry (plain object).
 */
async function sendInquiryNotification(inquiry) {
  if (!isConfigured) {
    logger.info(`[MOCK EMAIL] Inquiry notification for ${inquiry.name} <${inquiry.email}> - Need: ${inquiry.need}`);
    return;
  }
  const subject = `New Project Inquiry | ${inquiry.need} | ${inquiry.company}`;
  await deliver({
    from: config.mail.from,
    to: config.mail.hrEmail, // notify the core team inbox
    replyTo: `"${inquiry.name}" <${inquiry.email}>`,
    subject,
    html: templates.inquiryNotification(inquiry),
  });
  logger.info(`Project inquiry notification sent for ${inquiry._id}`);
}

module.exports = {
  verifyTransport,
  sendHrNotification,
  sendCandidateAcknowledgement,
  sendInquiryNotification,
};

