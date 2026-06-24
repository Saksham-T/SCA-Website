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

const transporter = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  secure: config.mail.secure,
  auth: { user: config.mail.user, pass: config.mail.pass },
});

/** Verify SMTP connectivity at startup; logs but does not crash the app. */
async function verifyTransport() {
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
  await transporter.sendMail({
    from: config.mail.from,
    to: app.email,
    subject: `We've received your application | ${config.mail.companyName}`,
    html: templates.candidateAcknowledgement(app),
  });
  logger.info(`Candidate acknowledgement sent for ${app.submissionId}`);
}

module.exports = {
  verifyTransport,
  sendHrNotification,
  sendCandidateAcknowledgement,
};
