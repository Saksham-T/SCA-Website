'use strict';

const TabularRecord = require('../models/TabularRecord');
const logger = require('../config/logger');

/**
 * Sync an Inquiry submission to TabularRecord
 */
async function syncInquiryToTabular(inquiry) {
  try {
    const data = {
      'ID': inquiry._id.toString(),
      'Name': inquiry.name,
      'Email': inquiry.email,
      'Phone': inquiry.phone || '',
      'Need': inquiry.need,
      'Budget': inquiry.budget,
      'Timeline': inquiry.timeline,
      'Brief': inquiry.brief,
      'IP': inquiry.meta ? inquiry.meta.ip : '',
      'User Agent': inquiry.meta ? inquiry.meta.userAgent : '',
      'Created At': inquiry.createdAt ? inquiry.createdAt.toISOString() : new Date().toISOString()
    };

    await TabularRecord.findOneAndUpdate(
      { tableName: 'inquiries', sourceId: inquiry._id },
      { tableName: 'inquiries', sourceId: inquiry._id, data },
      { upsert: true, new: true }
    );
    logger.info(`Synced Inquiry ${inquiry._id} to TabularRecord`);
  } catch (error) {
    logger.error(`Failed to sync Inquiry ${inquiry._id} to TabularRecord: ${error.message}`);
  }
}

/**
 * Sync an Application submission to TabularRecord
 */
async function syncApplicationToTabular(application) {
  try {
    const data = {
      'ID': application._id.toString(),
      'Submission ID': application.submissionId,
      'Full Name': application.fullName,
      'Email': application.email,
      'Phone': application.phone,
      'Location': application.location,
      'Country': application.country,
      'Position': application.position,
      'Experience (Years)': application.yearsOfExperience,
      'LinkedIn': application.linkedin || '',
      'Portfolio': application.portfolio || '',
      'Willing to Relocate': application.willingToRelocate,
      'Preferred Work Mode': application.preferredWorkMode,
      'Joining Availability': application.joiningAvailability,
      'Cover Letter': application.coverLetter || '',
      'Resume File Name': application.resume ? application.resume.originalName : '',
      'Resume Stored Name': application.resume ? application.resume.storedName : '',
      'Resume Path': application.resume ? application.resume.path : '',
      'Resume URL': application.resume ? application.resume.url : '',
      'Status': application.status,
      'IP': application.meta ? application.meta.ip : '',
      'User Agent': application.meta ? application.meta.userAgent : '',
      'Created At': application.createdAt ? application.createdAt.toISOString() : new Date().toISOString()
    };

    if (application.additionalFields && typeof application.additionalFields.forEach === 'function') {
      application.additionalFields.forEach((value, key) => {
        data[`Additional - ${key}`] = value;
      });
    }

    await TabularRecord.findOneAndUpdate(
      { tableName: 'applications', sourceId: application._id },
      { tableName: 'applications', sourceId: application._id, data },
      { upsert: true, new: true }
    );
    logger.info(`Synced Application ${application._id} to TabularRecord`);
  } catch (error) {
    logger.error(`Failed to sync Application ${application._id} to TabularRecord: ${error.message}`);
  }
}

/**
 * Sync a Newsletter subscription to TabularRecord
 */
async function syncNewsletterToTabular(newsletter) {
  try {
    const data = {
      'ID': newsletter._id.toString(),
      'Email': newsletter.email,
      'IP': newsletter.meta ? newsletter.meta.ip : '',
      'User Agent': newsletter.meta ? newsletter.meta.userAgent : '',
      'Created At': newsletter.createdAt ? newsletter.createdAt.toISOString() : new Date().toISOString()
    };

    await TabularRecord.findOneAndUpdate(
      { tableName: 'newsletters', sourceId: newsletter._id },
      { tableName: 'newsletters', sourceId: newsletter._id, data },
      { upsert: true, new: true }
    );
    logger.info(`Synced Newsletter ${newsletter._id} to TabularRecord`);
  } catch (error) {
    logger.error(`Failed to sync Newsletter ${newsletter._id} to TabularRecord: ${error.message}`);
  }
}

module.exports = {
  syncInquiryToTabular,
  syncApplicationToTabular,
  syncNewsletterToTabular
};
