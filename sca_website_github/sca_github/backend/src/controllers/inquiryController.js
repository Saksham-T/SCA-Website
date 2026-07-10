'use strict';

const Inquiry = require('../models/Inquiry');
const emailService = require('../services/emailService');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../config/logger');
const v = require('../utils/validators');
const ApiError = require('../utils/ApiError');
const { cleanValue } = require('../middleware/sanitize');
const { syncInquiryToTabular } = require('../utils/syncTabular');

/**
 * Handle new client inquiry submissions.
 */
const submitInquiry = asyncHandler(async (req, res, next) => {
  const body = req.body || {};
  const errors = [];
  const add = (field, message) => errors.push({ field, message });

  const str = (key) => (typeof body[key] === 'string' ? body[key].trim() : '');

  // 1. Validation
  const need = str('need');
  if (!v.isNonEmpty(need)) add('need', 'Field need is required.');

  const budget = str('budget');
  if (!v.isNonEmpty(budget)) add('budget', 'Monthly budget is required.');

  const timeline = str('timeline');
  if (!v.isNonEmpty(timeline)) add('timeline', 'Timeline is required.');

  const name = str('name');
  if (!v.isNonEmpty(name)) add('name', 'Name is required.');
  else if (name.length > 120) add('name', 'Must be at most 120 characters.');

  const company = str('company');
  if (!v.isNonEmpty(company)) add('company', 'Company/brand is required.');
  else if (company.length > 120) add('company', 'Must be at most 120 characters.');

  const email = str('email');
  if (!v.isNonEmpty(email)) add('email', 'Email address is required.');
  else if (!v.isEmail(email)) add('email', 'Enter a valid email address.');

  const phone = str('phone');
  if (phone && phone.length > 32) add('phone', 'Must be at most 32 characters.');

  const brief = str('brief');
  if (!v.isNonEmpty(brief)) add('brief', 'Project brief/situation is required.');
  else if (brief.length > 5000) add('brief', 'Must be at most 5000 characters.');

  if (errors.length > 0) {
    return next(ApiError.badRequest('Validation failed.', errors));
  }

  // 2. HTML sanitization on body inputs
  const sanitized = {
    need: cleanValue(need),
    budget: cleanValue(budget),
    timeline: cleanValue(timeline),
    name: cleanValue(name),
    company: cleanValue(company),
    email: cleanValue(email),
    phone: cleanValue(phone),
    brief: cleanValue(brief),
  };

  // 3. Save to database
  const inquiry = await Inquiry.create({
    ...sanitized,
    meta: {
      ip: req.ip,
      userAgent: req.get('user-agent') || '',
    },
  });

  logger.info(`Inquiry saved: ${inquiry._id} (${inquiry.email})`);

  // Sync to TabularRecord (non-blocking)
  syncInquiryToTabular(inquiry).catch((err) => {
    logger.error(`Error in post-save syncInquiryToTabular: ${err.message}`);
  });

  // 4. Send email notification (non-blocking)
  try {
    await emailService.sendInquiryNotification(inquiry.toObject());
  } catch (err) {
    logger.error(`Inquiry email notification failed for ${inquiry._id}: ${err.message}`);
  }

  return res.status(201).json({
    success: true,
    message: 'Inquiry received. We will get back to you shortly.',
    data: {
      id: inquiry._id,
      createdAt: inquiry.createdAt,
    },
  });
});

module.exports = { submitInquiry };
