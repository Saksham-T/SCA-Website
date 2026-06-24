'use strict';

/**
 * Centralised, validated configuration.
 *
 * All environment access happens here so the rest of the codebase reads from a
 * single typed object instead of touching `process.env` directly. Missing
 * critical variables cause a fast, explicit crash at boot rather than obscure
 * runtime failures.
 */

const path = require('path');

// Single source of truth for credentials/config: the project-root `.env`
// (one level above this `backend/` package). The same file feeds the legacy
// Vercel function at `api/apply.js`. Falls back to any ambient env (e.g. vars
// injected by the Vercel/hosting platform) when the file is absent.
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

/** Read a required env var or throw at startup. */
function required(key) {
  const value = process.env[key];
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/** Read an env var with a fallback default. */
function optional(key, fallback) {
  const value = process.env[key];
  return value === undefined || value === '' ? fallback : value;
}

const NODE_ENV = optional('NODE_ENV', 'development');

const config = {
  env: NODE_ENV,
  isProd: NODE_ENV === 'production',
  port: parseInt(optional('PORT', '5000'), 10),

  corsOrigins: optional('CORS_ORIGINS', '*')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),

  db: {
    uri: required('MONGODB_URI'),
  },

  upload: {
    dir: path.resolve(process.cwd(), optional('UPLOAD_DIR', 'uploads/resumes')),
    maxFileSize: parseInt(optional('MAX_FILE_SIZE', String(5 * 1024 * 1024)), 10),
    publicBaseUrl: optional('PUBLIC_BASE_URL', ''),
    // Whitelisted resume formats — validated by BOTH mime type and extension.
    allowedMime: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    allowedExt: ['.pdf', '.doc', '.docx'],
  },

  mail: {
    host: required('SMTP_HOST'),
    port: parseInt(optional('SMTP_PORT', '587'), 10),
    secure: optional('SMTP_SECURE', 'false') === 'true',
    user: required('SMTP_USER'),
    pass: required('SMTP_PASS'),
    from: optional('EMAIL_FROM', `Careers <${process.env.SMTP_USER}>`),
    hrEmail: required('HR_EMAIL'),
    companyName: optional('COMPANY_NAME', 'SeeTusk'),
    companyWebsite: optional('COMPANY_WEBSITE', 'https://www.seetusk.com'),
    brandColor: optional('BRAND_COLOR', '#2e54ea'),
  },

  rateLimit: {
    windowMs: parseInt(optional('RATE_LIMIT_WINDOW_MINUTES', '15'), 10) * 60 * 1000,
    max: parseInt(optional('RATE_LIMIT_MAX', '5'), 10),
  },
};

module.exports = config;
