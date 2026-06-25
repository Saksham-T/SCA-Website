'use strict';

/**
 * Per-IP rate limiter for the application submission endpoint. Limits abusive
 * repeat submissions while staying generous enough for legitimate retries.
 */

const rateLimit = require('express-rate-limit');
const config = require('../config');
const ApiError = require('../utils/ApiError');

const applicationLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) =>
    next(
      ApiError.tooManyRequests(
        'Too many applications submitted from this IP. Please try again later.'
      )
    ),
});

module.exports = { applicationLimiter };
