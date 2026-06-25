'use strict';

/**
 * Express application factory. Wires security middleware, logging, routes and
 * the centralized error handlers. Kept separate from `server.js` so it can be
 * imported by tests without binding a port.
 */

const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const config = require('./config');
const logger = require('./config/logger');
const { mongoGuard } = require('./middleware/sanitize');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const applicationRoutes = require('./routes/applicationRoutes');
const jobRoutes = require('./routes/jobRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');

function createApp() {
  const app = express();

  // Required so req.ip / rate limiting work correctly behind a proxy (Vercel,
  // Nginx, etc.). Trust only the first hop.
  app.set('trust proxy', 1);

  // --- Security headers ---
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));

  // --- CORS ---
  app.use(
    cors({
      origin: config.corsOrigins.includes('*') ? true : config.corsOrigins,
      methods: ['GET', 'POST'],
    })
  );

  // --- Body parsers (with sane limits) ---
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // --- NoSQL injection guard on parsed bodies/queries ---
  app.use(mongoGuard);

  // --- HTTP request logging ---
  app.use(
    morgan(config.isProd ? 'combined' : 'dev', { stream: logger.stream })
  );

  // --- Static access to uploaded resumes (optional; for HR download links) ---
  app.use(
    '/uploads/resumes',
    express.static(config.upload.dir, { dotfiles: 'deny', index: false })
  );

  // --- Health check ---
  app.get('/health', (req, res) =>
    res.json({ status: 'ok', uptime: process.uptime() })
  );

  // --- API routes ---
  app.use('/api/applications', applicationRoutes);
  app.use('/api/jobs', jobRoutes);
  app.use('/api/inquiries', inquiryRoutes);
  app.use('/api/newsletters', newsletterRoutes);

  // --- 404 + centralized error handling (must be last) ---
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
