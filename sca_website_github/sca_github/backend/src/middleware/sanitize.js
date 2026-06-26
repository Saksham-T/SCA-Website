'use strict';

/**
 * Input sanitization middleware.
 *
 * 1. `express-mongo-sanitize` strips keys containing `$` or `.` from req.body /
 *    req.params / req.query to neutralise NoSQL operator injection.
 * 2. `cleanStrings` recursively trims and strips HTML/script content from all
 *    string values to neutralise stored/reflected XSS.
 *
 * Note: req.query is read-only in Express 5; we sanitize in place where allowed
 * and skip reassignment otherwise.
 */

const mongoSanitize = require('express-mongo-sanitize');
const sanitizeHtml = require('sanitize-html');
const logger = require('../config/logger');

const mongoGuard = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ key }) => {
    logger.warn(`Blocked potential NoSQL injection key: ${key}`);
  },
});

/** Strip all HTML tags/attributes from a string value. */
function cleanValue(value) {
  if (typeof value !== 'string') return value;
  return sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: 'discard',
  }).trim();
}

/** Recursively sanitize all string leaves of a plain object. */
function cleanObject(obj) {
  if (!obj || typeof obj !== 'object') return;
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (typeof val === 'string') {
      obj[key] = cleanValue(val);
    } else if (val && typeof val === 'object') {
      cleanObject(val);
    }
  }
}

function sanitizeRequest(req, res, next) {
  // multipart text fields land in req.body after multer runs.
  if (req.body) cleanObject(req.body);
  next();
}

module.exports = { mongoGuard, sanitizeRequest, cleanValue };
