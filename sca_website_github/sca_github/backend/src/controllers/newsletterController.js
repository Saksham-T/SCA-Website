'use strict';

const Newsletter = require('../models/Newsletter');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../config/logger');
const v = require('../utils/validators');
const ApiError = require('../utils/ApiError');
const { cleanValue } = require('../middleware/sanitize');
const { syncNewsletterToTabular } = require('../utils/syncTabular');

/**
 * Handle new newsletter subscriptions.
 */
const subscribeNewsletter = asyncHandler(async (req, res, next) => {
  const body = req.body || {};
  const email = typeof body.email === 'string' ? body.email.trim() : '';

  if (!v.isNonEmpty(email)) {
    return next(ApiError.badRequest('Email address is required.'));
  }
  if (!v.isEmail(email)) {
    return next(ApiError.badRequest('Enter a valid email address.'));
  }

  const sanitizedEmail = cleanValue(email);

  try {
    // Check if already subscribed
    const existing = await Newsletter.findOne({ email: sanitizedEmail });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed to the newsletter!',
      });
    }

    // Save subscription
    const subscription = await Newsletter.create({
      email: sanitizedEmail,
      meta: {
        ip: req.ip,
        userAgent: req.get('user-agent') || '',
      },
    });

    logger.info(`Newsletter subscription saved: ${subscription._id} (${subscription.email})`);

    // Sync to TabularRecord (non-blocking)
    syncNewsletterToTabular(subscription).catch((err) => {
      logger.error(`Error in post-save syncNewsletterToTabular: ${err.message}`);
    });

    return res.status(201).json({
      success: true,
      message: 'subscribed ✓ — check your inbox',
    });
  } catch (err) {
    if (err.code === 11000) {
      // Race condition safety duplicate check
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed to the newsletter!',
      });
    }
    return next(err);
  }
});

module.exports = { subscribeNewsletter };
