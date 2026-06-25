'use strict';

/**
 * Server-side validation for a career application.
 *
 * Runs after multer + sanitization. Collects ALL field errors before responding
 * so the client gets a complete, structured picture in one round-trip. On
 * success it attaches a normalised `req.validatedApplication` payload (including
 * any unknown/dynamic fields captured into `additionalFields`).
 */

const v = require('../utils/validators');
const ApiError = require('../utils/ApiError');
const { WORK_MODES, RELOCATE_OPTIONS } = require('../models/Application');

// Recognised form fields. Anything else submitted is preserved as a dynamic
// "additional field" rather than silently dropped.
const KNOWN_FIELDS = new Set([
  'fullName', 'email', 'phone', 'location', 'country',
  'position', 'yearsOfExperience', 'linkedin', 'portfolio',
  'willingToRelocate', 'preferredWorkMode', 'joiningAvailability',
  'coverLetter',
]);

// Reasonable length caps mirrored from the schema.
const MAX = {
  fullName: 120, email: 254, phone: 32, location: 160, country: 80,
  position: 120, linkedin: 300, portfolio: 300, joiningAvailability: 120,
  coverLetter: 5000,
};

function validateApplication(req, res, next) {
  const body = req.body || {};
  const errors = [];
  const add = (field, message) => errors.push({ field, message });

  const str = (key) => (typeof body[key] === 'string' ? body[key].trim() : '');

  // --- Required strings ---
  const fullName = str('fullName');
  if (!v.isNonEmpty(fullName)) add('fullName', 'Full name is required.');
  else if (fullName.length > MAX.fullName) add('fullName', `Must be at most ${MAX.fullName} characters.`);

  const email = str('email');
  if (!v.isNonEmpty(email)) add('email', 'Email address is required.');
  else if (!v.isEmail(email)) add('email', 'Enter a valid email address.');

  const phone = str('phone');
  if (!v.isNonEmpty(phone)) add('phone', 'Phone number is required.');
  else if (!v.isPhone(phone)) add('phone', 'Enter a valid phone number (7–20 digits).');

  const location = str('location');
  if (!v.isNonEmpty(location)) add('location', 'Current location is required.');
  else if (location.length > MAX.location) add('location', `Must be at most ${MAX.location} characters.`);

  const country = str('country');
  if (!v.isNonEmpty(country)) add('country', 'Country is required.');
  else if (country.length > MAX.country) add('country', `Must be at most ${MAX.country} characters.`);

  const position = str('position');
  if (!v.isNonEmpty(position)) add('position', 'Position applied for is required.');
  else if (position.length > MAX.position) add('position', `Must be at most ${MAX.position} characters.`);

  const joiningAvailability = str('joiningAvailability');
  if (!v.isNonEmpty(joiningAvailability)) add('joiningAvailability', 'Joining availability is required.');
  else if (joiningAvailability.length > MAX.joiningAvailability) add('joiningAvailability', `Must be at most ${MAX.joiningAvailability} characters.`);

  // --- Years of experience (numeric) ---
  const years = v.toExperienceNumber(body.yearsOfExperience);
  if (!v.isNonEmpty(String(body.yearsOfExperience ?? ''))) {
    add('yearsOfExperience', 'Years of experience is required.');
  } else if (Number.isNaN(years) || years < 0 || years > 60) {
    add('yearsOfExperience', 'Enter a valid number of years (0–60).');
  }

  // --- Enums ---
  const willingToRelocate = str('willingToRelocate');
  if (!v.isNonEmpty(willingToRelocate)) add('willingToRelocate', 'Relocation preference is required.');
  else if (!v.inEnum(willingToRelocate, RELOCATE_OPTIONS))
    add('willingToRelocate', `Must be one of: ${RELOCATE_OPTIONS.join(', ')}.`);

  const preferredWorkMode = str('preferredWorkMode');
  if (!v.isNonEmpty(preferredWorkMode)) add('preferredWorkMode', 'Preferred work mode is required.');
  else if (!v.inEnum(preferredWorkMode, WORK_MODES))
    add('preferredWorkMode', `Must be one of: ${WORK_MODES.join(', ')}.`);

  // --- Optional URLs ---
  const linkedin = str('linkedin');
  if (linkedin) {
    if (linkedin.length > MAX.linkedin) add('linkedin', `Must be at most ${MAX.linkedin} characters.`);
    else if (!v.isLinkedInUrl(linkedin)) add('linkedin', 'Enter a valid LinkedIn profile URL (https://linkedin.com/...).');
  }

  const portfolio = str('portfolio');
  if (portfolio) {
    if (portfolio.length > MAX.portfolio) add('portfolio', `Must be at most ${MAX.portfolio} characters.`);
    else if (!v.isUrl(portfolio)) add('portfolio', 'Enter a valid portfolio URL (must start with http/https).');
  }

  // --- Optional cover letter ---
  const coverLetter = str('coverLetter');
  if (coverLetter && coverLetter.length > MAX.coverLetter)
    add('coverLetter', `Must be at most ${MAX.coverLetter} characters.`);

  // --- Resume presence (file validated by upload middleware) ---
  if (!req.file) add('resume', 'A resume file (PDF, DOC or DOCX) is required.');

  if (errors.length > 0) {
    return next(ApiError.badRequest('Validation failed. Please correct the highlighted fields.', errors));
  }

  // --- Collect dynamic/additional fields ---
  const additionalFields = {};
  for (const key of Object.keys(body)) {
    if (!KNOWN_FIELDS.has(key) && typeof body[key] === 'string' && body[key].trim()) {
      additionalFields[key] = body[key].trim().slice(0, 1000);
    }
  }

  req.validatedApplication = {
    fullName, email, phone, location, country,
    position, yearsOfExperience: years, linkedin, portfolio,
    willingToRelocate, preferredWorkMode, joiningAvailability, coverLetter,
    additionalFields: Object.keys(additionalFields).length ? additionalFields : undefined,
  };

  next();
}

module.exports = validateApplication;
