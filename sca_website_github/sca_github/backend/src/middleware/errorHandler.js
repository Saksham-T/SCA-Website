'use strict';

/**
 * Centralized error handling + 404 fallback.
 *
 * - `notFound` produces a clean 404 for unmatched routes.
 * - `errorHandler` is the single place every error funnels through. Operational
 *   ApiErrors are surfaced with their status/details; everything else becomes a
 *   generic 500 (details hidden in production) and is logged with a stack trace.
 * - Best-effort cleanup removes any uploaded resume when the request ultimately
 *   fails, so we don't accumulate orphan files on disk.
 */

const fs = require('fs');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const config = require('../config');

function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars -- Express needs the 4-arg signature.
function errorHandler(err, req, res, next) {
  // Clean up an orphaned upload if the request failed after the file landed.
  if (req.file && req.file.path) {
    fs.promises
      .unlink(req.file.path)
      .catch((e) => logger.warn(`Failed to clean up upload ${req.file.path}: ${e.message}`));
  }

  const isApiError = err instanceof ApiError;
  const statusCode = isApiError ? err.statusCode : 500;

  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} -> ${statusCode}: ${err.message}\n${err.stack}`);
  } else {
    logger.warn(`${req.method} ${req.originalUrl} -> ${statusCode}: ${err.message}`);
  }

  const body = {
    success: false,
    message:
      isApiError || !config.isProd ? err.message : 'Something went wrong. Please try again later.',
  };

  if (isApiError && err.errors && err.errors.length) {
    body.errors = err.errors;
  }

  if (!config.isProd && statusCode >= 500) {
    body.stack = err.stack;
  }

  res.status(statusCode).json(body);
}

module.exports = { notFound, errorHandler };
