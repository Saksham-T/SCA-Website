'use strict';

/**
 * Application model.
 *
 * Stores one career application: a unique submission id, timestamps, the full
 * applicant payload, a reference to the stored resume and a workflow status.
 * Server-side validation is duplicated here (Mongoose schema) so the database
 * stays consistent even if a record is created outside the HTTP layer.
 */

const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');

// Human-friendly, collision-resistant submission id, e.g. "APP-7F3K9Q2X4M".
const nanoid = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 10);

const WORK_MODES = ['On-site', 'Hybrid', 'Remote'];
const RELOCATE_OPTIONS = ['Yes', 'No', 'Maybe'];
const STATUSES = ['New', 'Reviewing', 'Shortlisted', 'Rejected', 'Hired'];

const resumeSchema = new mongoose.Schema(
  {
    originalName: { type: String, required: true },
    storedName: { type: String, required: true },
    // The actual file bytes are stored in MongoDB so a later (off-host) job can
    // attach them — Render's disk is ephemeral, so `path` is not reliable.
    data: { type: Buffer, required: true },
    path: { type: String, default: '' },
    url: { type: String, default: '' },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    submissionId: {
      type: String,
      unique: true,
      index: true,
      default: () => `APP-${nanoid()}`,
    },

    // --- Personal info ---
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      index: true,
    },
    phone: { type: String, required: true, trim: true, maxlength: 32 },
    location: { type: String, required: true, trim: true, maxlength: 160 },
    country: { type: String, required: true, trim: true, maxlength: 80 },

    // --- Professional details ---
    position: { type: String, required: true, trim: true, maxlength: 120 },
    yearsOfExperience: { type: Number, required: true, min: 0, max: 60 },
    linkedin: { type: String, trim: true, maxlength: 300, default: '' },
    portfolio: { type: String, trim: true, maxlength: 300, default: '' },

    // --- Application details ---
    willingToRelocate: {
      type: String,
      enum: RELOCATE_OPTIONS,
      required: true,
    },
    preferredWorkMode: {
      type: String,
      enum: WORK_MODES,
      required: true,
    },
    joiningAvailability: { type: String, required: true, trim: true, maxlength: 120 },
    coverLetter: { type: String, trim: true, maxlength: 5000, default: '' },

    // Any additional dynamic fields the form may submit, kept as-is.
    additionalFields: { type: Map, of: String, default: undefined },

    resume: { type: resumeSchema, required: true },

    status: { type: String, enum: STATUSES, default: 'New', index: true },

    // --- Email delivery tracking (handled by an off-host scheduled job) ---
    emailedToHr: { type: Boolean, default: false, index: true },
    emailedCandidate: { type: Boolean, default: false },
    emailedAt: { type: Date, default: null },

    // Light request metadata for auditing / abuse investigation.
    meta: {
      ip: { type: String, default: '' },
      userAgent: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
module.exports.WORK_MODES = WORK_MODES;
module.exports.RELOCATE_OPTIONS = RELOCATE_OPTIONS;
module.exports.STATUSES = STATUSES;
