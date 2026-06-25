'use strict';

/**
 * Lightweight anti-bot protection.
 *
 * 1. Honeypot: a hidden field (default name "company_website") that humans never
 *    see/fill. If populated, the submission is silently treated as success to
 *    avoid giving bots feedback — but nothing is processed.
 * 2. Time-trap: an optional `form_render_ts` (epoch ms) the frontend stamps when
 *    the form renders. Submissions faster than MIN_FILL_MS are likely bots.
 *
 * Runs AFTER multer so multipart text fields are available on req.body.
 */

const logger = require('../config/logger');

const HONEYPOT_FIELD = 'company_website';
const MIN_FILL_MS = 2500; // realistic minimum time to complete the form

function spamProtection(req, res, next) {
  const body = req.body || {};

  // 1. Honeypot — must be empty.
  if (body[HONEYPOT_FIELD] && String(body[HONEYPOT_FIELD]).trim() !== '') {
    logger.warn(`Honeypot triggered from IP ${req.ip} — dropping submission.`);
    // Respond 200 so bots can't distinguish success from rejection.
    return res.status(200).json({
      success: true,
      message: 'Application received.',
    });
  }

  // 2. Time-trap (only enforced when the timestamp is provided).
  const ts = parseInt(body.form_render_ts, 10);
  if (!Number.isNaN(ts)) {
    const elapsed = Date.now() - ts;
    if (elapsed >= 0 && elapsed < MIN_FILL_MS) {
      logger.warn(`Time-trap triggered (${elapsed}ms) from IP ${req.ip} — dropping submission.`);
      return res.status(200).json({
        success: true,
        message: 'Application received.',
      });
    }
  }

  // Remove anti-bot helper fields so they never reach the DB.
  delete body[HONEYPOT_FIELD];
  delete body.form_render_ts;

  next();
}

module.exports = spamProtection;
module.exports.HONEYPOT_FIELD = HONEYPOT_FIELD;
