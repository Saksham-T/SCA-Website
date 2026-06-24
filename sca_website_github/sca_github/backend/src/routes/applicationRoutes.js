'use strict';

/**
 * Career application routes.
 *
 * POST /api/applications
 *   multipart/form-data — applicant fields + a single `resume` file.
 *
 * Middleware order matters:
 *   rate limit → multer (parse multipart + file) → spam check (needs body) →
 *   sanitize text → validate → controller.
 */

const express = require('express');
const { applicationLimiter } = require('../middleware/rateLimiter');
const resumeUpload = require('../middleware/upload');
const spamProtection = require('../middleware/spamProtection');
const { sanitizeRequest } = require('../middleware/sanitize');
const validateApplication = require('../middleware/validateApplication');
const { submitApplication } = require('../controllers/applicationController');

const router = express.Router();

router.post(
  '/',
  applicationLimiter,
  resumeUpload,
  spamProtection,
  sanitizeRequest,
  validateApplication,
  submitApplication
);

module.exports = router;
