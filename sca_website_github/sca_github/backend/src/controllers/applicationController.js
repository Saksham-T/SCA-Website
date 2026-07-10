'use strict';

/**
 * Application submission controller — orchestrates the full workflow:
 *
 *   validate (done in middleware) → persist resume reference → save record →
 *   email HR (resume attached) → acknowledge candidate → return submission id.
 *
 * The database record is the source of truth: once it is saved the submission is
 * considered successful. Email delivery is attempted immediately but a transient
 * SMTP failure does NOT lose the application — it is logged and flagged in the
 * response so the candidate still gets a confirmation of receipt.
 */

const path = require('path');
const Application = require('../models/Application');
const emailService = require('../services/emailService');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../config/logger');
const config = require('../config');
const { syncApplicationToTabular } = require('../utils/syncTabular');

/** Build a public download URL for a stored resume, when a base URL is set. */
function buildResumeUrl(storedName) {
  if (!config.upload.publicBaseUrl) return '';
  return `${config.upload.publicBaseUrl.replace(/\/$/, '')}/uploads/resumes/${encodeURIComponent(
    storedName
  )}`;
}

const submitApplication = asyncHandler(async (req, res) => {
  const data = req.validatedApplication;
  const file = req.file; // guaranteed present by validation middleware

  const storedName = path.basename(file.path);

  // 1. Build the persisted record (status defaults to "New").
  const application = await Application.create({
    ...data,
    resume: {
      originalName: file.originalname,
      storedName,
      path: file.path,
      url: buildResumeUrl(storedName),
      mimeType: file.mimetype,
      size: file.size,
    },
    meta: {
      ip: req.ip,
      userAgent: req.get('user-agent') || '',
    },
  });

  logger.info(`Application saved: ${application.submissionId} (${application.email})`);

  // Sync to TabularRecord (non-blocking)
  syncApplicationToTabular(application).catch((err) => {
    logger.error(`Error in post-save syncApplicationToTabular: ${err.message}`);
  });

  // 2. Fire the two emails. Failures are captured, not fatal.
  const plain = application.toObject();
  const emailStatus = { hr: false, candidate: false };

  try {
    await emailService.sendHrNotification(plain);
    emailStatus.hr = true;
  } catch (err) {
    logger.error(`HR notification failed for ${application.submissionId}: ${err.message}`);
  }

  try {
    await emailService.sendCandidateAcknowledgement(plain);
    emailStatus.candidate = true;
  } catch (err) {
    logger.error(`Candidate acknowledgement failed for ${application.submissionId}: ${err.message}`);
  }

  // 3. Respond.
  return res.status(201).json({
    success: true,
    message: 'Application submitted successfully.',
    data: {
      submissionId: application.submissionId,
      status: application.status,
      submittedAt: application.createdAt,
      notifications: emailStatus,
    },
  });
});

module.exports = { submitApplication };
