'use strict';

/**
 * Winston logger. Pretty/colourised in development, JSON in production so it can
 * be consumed by log aggregators. Errors are persisted to logs/error.log and all
 * levels to logs/combined.log.
 */

const fs = require('fs');
const path = require('path');
const winston = require('winston');
const config = require('./index');

const logDir = path.resolve(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(
    ({ level, message, timestamp, stack }) =>
      `${timestamp} ${level}: ${stack || message}`
  )
);

const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const logger = winston.createLogger({
  level: config.isProd ? 'info' : 'debug',
  format: config.isProd ? prodFormat : devFormat,
  defaultMeta: { service: 'sca-careers-backend' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
    }),
  ],
  exitOnError: false,
});

/** Stream adapter so Morgan HTTP logs flow through Winston. */
logger.stream = {
  write: (message) => logger.http(message.trim()),
};

module.exports = logger;
