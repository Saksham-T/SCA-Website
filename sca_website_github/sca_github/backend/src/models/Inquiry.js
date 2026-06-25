'use strict';

/**
 * Inquiry model.
 * Stores contact briefs and new client submissions.
 */

const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    need: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    budget: {
      type: String,
      required: true,
      trim: true,
    },
    timeline: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    company: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
      maxlength: 254,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
      maxlength: 32,
    },
    brief: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    meta: {
      ip: { type: String, default: '' },
      userAgent: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
