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
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin) return callback(null, true);

        // If wildcard is in config.corsOrigins, allow all
        if (config.corsOrigins.includes('*')) {
          return callback(null, true);
        }

        // Check if origin matches exactly
        if (config.corsOrigins.includes(origin)) {
          return callback(null, true);
        }

        // Dynamic check: Allow dev.seetusk.com or any subdomains of seetusk.com / seetusk.agency
        try {
          const url = new URL(origin);
          const hostname = url.hostname;
          if (
            hostname === 'seetusk.com' ||
            hostname.endsWith('.seetusk.com') ||
            hostname === 'seetusk.agency' ||
            hostname.endsWith('.seetusk.agency')
          ) {
            return callback(null, true);
          }
        } catch (e) {
          // ignore invalid URLs
        }

        // Otherwise reject CORS
        callback(null, false);
      },
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

  // --- TEMPORARY: outbound SMTP-port reachability probe (remove after use) ---
  // Tests whether this host can open TCP connections to common mail ports.
  // Guarded by a token so it isn't openly callable: /debug/net?key=<DEBUG_KEY>
  app.get('/debug/net', async (req, res) => {
    const net = require('net');
    if (!process.env.DEBUG_KEY || req.query.key !== process.env.DEBUG_KEY) {
      return res.status(403).json({ error: 'forbidden' });
    }
    const targets = [
      ['smtp.gmail.com', 587],
      ['smtp.gmail.com', 465],
      ['smtp.gmail.com', 2525],
      ['smtp-relay.brevo.com', 587],
      ['smtp-relay.brevo.com', 2525],
      ['smtp-relay.brevo.com', 465],
    ];
    const probe = ([host, port]) =>
      new Promise((resolve) => {
        const started = Date.now();
        const socket = net.connect({ host, port, family: 4 });
        const done = (result) => {
          socket.destroy();
          resolve({ target: `${host}:${port}`, result, ms: Date.now() - started });
        };
        socket.setTimeout(8000);
        socket.once('connect', () => done('connected'));
        socket.once('timeout', () => done('timeout (blocked)'));
        socket.once('error', (e) => done(`error: ${e.code || e.message}`));
      });
    const results = await Promise.all(targets.map(probe));
    return res.json({ host: 'render', results });
  });

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
