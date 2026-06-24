'use strict';

/**
 * MongoDB connection helper. Connects with sane production defaults and wires
 * connection lifecycle events into the logger.
 */

const mongoose = require('mongoose');
const config = require('./index');
const logger = require('./logger');

// Reject unknown query operators globally — defence-in-depth against injection.
mongoose.set('strictQuery', true);

async function connectDB() {
  mongoose.connection.on('connected', () => logger.info('MongoDB connected'));
  mongoose.connection.on('error', (err) =>
    logger.error(`MongoDB connection error: ${err.message}`)
  );
  mongoose.connection.on('disconnected', () =>
    logger.warn('MongoDB disconnected')
  );

  await mongoose.connect(config.db.uri, {
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 10,
  });

  return mongoose.connection;
}

module.exports = connectDB;
