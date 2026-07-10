'use strict';

const Inquiry = require('../models/Inquiry');
const Application = require('../models/Application');
const Newsletter = require('../models/Newsletter');
const {
  syncInquiryToTabular,
  syncApplicationToTabular,
  syncNewsletterToTabular
} = require('../utils/syncTabular');
const logger = require('../config/logger');

async function migrateAllToTabular() {
  logger.info('Starting database tabular migration/sync...');
  try {
    // 1. Inquiries
    const inquiries = await Inquiry.find({});
    logger.info(`Found ${inquiries.length} inquiries to sync.`);
    for (const inquiry of inquiries) {
      await syncInquiryToTabular(inquiry);
    }

    // 2. Applications
    const applications = await Application.find({});
    logger.info(`Found ${applications.length} applications to sync.`);
    for (const application of applications) {
      await syncApplicationToTabular(application);
    }

    // 3. Newsletters
    const newsletters = await Newsletter.find({});
    logger.info(`Found ${newsletters.length} newsletters to sync.`);
    for (const newsletter of newsletters) {
      await syncNewsletterToTabular(newsletter);
    }

    logger.info('Database tabular migration/sync completed successfully.');
  } catch (error) {
    logger.error(`Database tabular migration/sync failed: ${error.message}`);
  }
}

module.exports = migrateAllToTabular;
