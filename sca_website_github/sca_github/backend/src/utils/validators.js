'use strict';

/**
 * Pure validation/normalisation helpers built on top of `validator`.
 * Kept framework-agnostic so they can be unit-tested in isolation and reused by
 * both the request validator middleware and the Mongoose layer.
 */

const validator = require('validator');

const isNonEmpty = (v) => typeof v === 'string' && v.trim().length > 0;

const isEmail = (v) =>
  isNonEmpty(v) && validator.isEmail(v.trim()) && v.length <= 254;

// Permissive international phone check: 7–20 digits, optional leading +,
// spaces/dashes/parentheses allowed.
const isPhone = (v) => {
  if (!isNonEmpty(v)) return false;
  const cleaned = v.replace(/[\s().-]/g, '');
  return /^\+?\d{7,20}$/.test(cleaned);
};

const isUrl = (v) =>
  isNonEmpty(v) &&
  validator.isURL(v.trim(), {
    protocols: ['http', 'https'],
    require_protocol: true,
    require_valid_protocol: true,
  });

const isLinkedInUrl = (v) =>
  isUrl(v) && /(^|\.)linkedin\.com$/i.test(safeHostname(v));

/** Extract a hostname without throwing on malformed input. */
function safeHostname(v) {
  try {
    return new URL(v.trim()).hostname;
  } catch {
    return '';
  }
}

const inEnum = (v, allowed) => allowed.includes(v);

/** Parse "5", "5 years", "5+" → 5; returns NaN when not parseable. */
const toExperienceNumber = (v) => {
  if (typeof v === 'number') return v;
  if (!isNonEmpty(v)) return NaN;
  const match = String(v).match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : NaN;
};

module.exports = {
  isNonEmpty,
  isEmail,
  isPhone,
  isUrl,
  isLinkedInUrl,
  inEnum,
  toExperienceNumber,
  safeHostname,
};
