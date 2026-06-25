'use strict';

/**
 * Process entrypoint. Connects to MongoDB, verifies SMTP, starts the HTTP server
 * and installs global guards so an unexpected error never silently crashes the
 * process without a log line.
 */

const createApp = require('./src/app');
const connectDB = require('./src/config/db');
const config = require('./src/config');
const logger = require('./src/config/logger');
const emailService = require('./src/services/emailService');

async function start() {
  try {
    await connectDB();

    // Non-blocking SMTP readiness check.
    emailService.verifyTransport();

    const app = createApp();
    const server = app.listen(config.port, () => {
      logger.info(`Server listening on port ${config.port} [${config.env}]`);
    });

    // Graceful shutdown.
    const shutdown = (signal) => {
      logger.info(`${signal} received — shutting down gracefully.`);
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
      // Force-exit if cleanup hangs.
      setTimeout(() => process.exit(1), 10000).unref();
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    logger.error(`Fatal startup error: ${err.message}\n${err.stack}`);
    process.exit(1);
  }
}

// Global safety nets — log, don't crash silently.
process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled Rejection: ${reason instanceof Error ? reason.stack : reason}`);
});
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.stack || err.message}`);
  process.exit(1);
});

start();
