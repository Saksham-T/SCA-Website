'use strict';

/**
 * Multer-based resume upload middleware.
 *
 * - Stores files on disk in the configured upload directory.
 * - Sanitises and uniquely names every stored file.
 * - Accepts ONLY pdf/doc/docx, validated by BOTH extension and mime type.
 * - Enforces a single file and a max size from config.
 *
 * Multer errors (size, unexpected field) are normalised into ApiError by
 * `resumeUpload` so the central error handler returns clean 400 responses.
 */

const multer = require('multer');
const config = require('../config');
const ApiError = require('../utils/ApiError');

// In-memory storage: the file lands in `req.file.buffer`, which the controller
// persists into MongoDB. We do NOT write to disk because the host's filesystem
// is ephemeral and the actual sending happens later, off-host.
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeOk = config.upload.allowedMime.includes(file.mimetype);
  const extOk = config.upload.allowedExt.includes(ext);

  if (mimeOk && extOk) return cb(null, true);

  // Reject with a typed error; surfaced as 400 by the wrapper below.
  cb(
    ApiError.badRequest(
      'Invalid resume format. Only PDF, DOC and DOCX files are allowed.',
      [{ field: 'resume', message: `Rejected file "${file.originalname}" (${file.mimetype}).` }]
    )
  );
}

const multerUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize,
    files: 1,
  },
}).single('resume');

/**
 * Express middleware wrapping multer so all upload failures become ApiError.
 */
function resumeUpload(req, res, next) {
  multerUpload(req, res, (err) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        const mb = (config.upload.maxFileSize / (1024 * 1024)).toFixed(1);
        return next(
          ApiError.badRequest(`Resume is too large. Maximum allowed size is ${mb} MB.`, [
            { field: 'resume', message: 'File exceeds the size limit.' },
          ])
        );
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return next(
          ApiError.badRequest('Unexpected file upload. Use the "resume" field for a single file.', [
            { field: 'resume', message: 'Only one resume file is allowed.' },
          ])
        );
      }
      return next(ApiError.badRequest(`File upload error: ${err.message}`));
    }

    // Already an ApiError (fileFilter) or unknown error.
    return next(err);
  });
}

module.exports = resumeUpload;
