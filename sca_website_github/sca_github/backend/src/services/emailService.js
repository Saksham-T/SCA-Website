'use strict';

/**
 * Email service built on Nodemailer.
 *
 * A single reusable transporter is created from config. The service exposes two
 * high-level operations used by the application workflow: notifying HR (with the
 * resume attached) and acknowledging the candidate.
 */

const nodemailer = require('nodemailer');
const config = require('../config');
const logger = require('../config/logger');
const templates = require('../utils/emailTemplates');

const isConfigured =
  config.mail.host &&
  config.mail.user &&
  config.mail.pass &&
  !config.mail.pass.includes('placeholder') &&
  !config.mail.pass.includes('your-smtp');

const transporter = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  secure: config.mail.secure,
  auth: { user: config.mail.user, pass: config.mail.pass },
  connectionTimeout: 5000, // 5 seconds
  greetingTimeout: 5000,   // 5 seconds
  socketTimeout: 5000,     // 5 seconds
});

/** Verify SMTP connectivity at startup; logs but does not crash the app. */
async function verifyTransport() {
  if (!isConfigured) {
    logger.warn('SMTP credentials are not fully configured (using placeholders). Email sending is mocked.');
    return;
  }
  try {
    await transporter.verify();
    logger.info('SMTP transport verified and ready.');
  } catch (err) {
    logger.error(`SMTP verification failed: ${err.message}`);
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
  const subject = `New Career Application | ${app.position} | ${app.fullName}`;
  await transporter.sendMail({
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
  await transporter.sendMail({
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
  await transporter.sendMail({
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

