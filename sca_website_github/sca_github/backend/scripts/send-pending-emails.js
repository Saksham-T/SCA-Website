'use strict';

/**
 * Scheduled email dispatcher (runs OFF the app host, e.g. GitHub Actions).
 *
 * The web app (on Render) only stores applications in MongoDB — it can't reach
 * SMTP. This job, running where SMTP egress is allowed, finds applications that
 * haven't been emailed to HR yet, sends each via nodemailer (HR notification
 * with the resume attached + candidate acknowledgement), and marks them sent.
 *
 * It is idempotent: only records with emailedToHr=false are processed, and each
 * is flagged immediately after a successful HR send, so re-runs never duplicate.
 *
 * Run:  node backend/scripts/send-pending-emails.js
 * Requires the same env as the backend (MONGODB_URI, SMTP_*, EMAIL_FROM,
 * HR_EMAIL, …). Force pure SMTP by leaving GMAIL_*/BREVO_API_KEY unset.
 */

const mongoose = require('mongoose');
const config = require('../src/config');
const logger = require('../src/config/logger');
const Application = require('../src/models/Application');
const emailService = require('../src/services/emailService');

const BATCH_LIMIT = parseInt(process.env.EMAIL_BATCH_LIMIT || '50', 10);

async function run() {
  await mongoose.connect(config.db.uri);
  logger.info('Dispatcher connected to MongoDB.');

  // Oldest first; cap the batch so a backlog can't blow up a single run.
  // Require resume bytes so legacy records (pre-DB-storage) are skipped, not
  // retried forever.
  const pending = await Application.find({
    emailedToHr: { $ne: true },
    'resume.data': { $exists: true, $ne: null },
  })
    .sort({ createdAt: 1 })
    .limit(BATCH_LIMIT);

  if (pending.length === 0) {
    logger.info('No pending applications to email.');
    return { sent: 0, failed: 0 };
  }

  logger.info(`Found ${pending.length} pending application(s) to email.`);
  let sent = 0;
  let failed = 0;

  for (const app of pending) {
    const plain = app.toObject({ flattenMaps: true });
    try {
      await emailService.sendHrNotification(plain);
      app.emailedToHr = true;
      app.emailedAt = new Date();

      // Candidate acknowledgement is best-effort; don't fail the record on it.
      try {
        await emailService.sendCandidateAcknowledgement(plain);
        app.emailedCandidate = true;
      } catch (ackErr) {
        logger.warn(`Candidate ack failed for ${app.submissionId}: ${ackErr.message}`);
      }

      await app.save();
      sent += 1;
      logger.info(`Emailed HR for ${app.submissionId} (${app.email}).`);
    } catch (err) {
      failed += 1;
      logger.error(`Failed to email HR for ${app.submissionId}: ${err.message}`);
    }
  }

  return { sent, failed };
}

run()
  .then(({ sent, failed }) => {
    logger.info(`Dispatcher done. Sent: ${sent}, Failed: ${failed}.`);
    return mongoose.disconnect();
  })
  .then(() => process.exit(0))
  .catch(async (err) => {
    logger.error(`Dispatcher fatal error: ${err.message}\n${err.stack}`);
    try {
      await mongoose.disconnect();
    } catch (_) {
      /* ignore */
    }
    process.exit(1);
  });
