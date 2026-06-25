'use strict';

/**
 * Application submission controller.
 *
 *   validate (middleware) → persist record + resume bytes → return submission id.
 *
 * Email delivery to HR is intentionally NOT done here: this host (Render) cannot
 * reach SMTP. Instead the resume bytes are stored in MongoDB and a scheduled,
 * off-host job (GitHub Actions) emails HR via nodemailer and marks the record
 * as sent. The database record is the source of truth.
 */

const path = require('path');
const crypto = require('crypto');
const Application = require('../models/Application');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../config/logger');

/** Slugify the original base name to a safe ascii token for storedName. */
function safeBaseName(originalName) {
  const base = path.basename(originalName, path.extname(originalName));
  return (
    base
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'resume'
  );
}

const submitApplication = asyncHandler(async (req, res) => {
  const data = req.validatedApplication;
  const file = req.file; // guaranteed present by validation middleware (memory storage)

  const ext = path.extname(file.originalname).toLowerCase();
  const storedName = `${safeBaseName(file.originalname)}-${Date.now()}-${crypto
    .randomBytes(6)
    .toString('hex')}${ext}`;

  // Persist the record INCLUDING the resume bytes, so the off-host email job can
  // attach the file later (the host's disk is ephemeral).
  const application = await Application.create({
    ...data,
    resume: {
      originalName: file.originalname,
      storedName,
      data: file.buffer,
      mimeType: file.mimetype,
      size: file.size,
    },
    meta: {
      ip: req.ip,
      userAgent: req.get('user-agent') || '',
    },
  });

  logger.info(
    `Application saved: ${application.submissionId} (${application.email}) — queued for HR email`
  );

  return res.status(201).json({
    success: true,
    message: 'Application submitted successfully.',
    data: {
      submissionId: application.submissionId,
      status: application.status,
      submittedAt: application.createdAt,
      notifications: { hr: 'queued', candidate: 'queued' },
    },
  });
});

module.exports = { submitApplication };
