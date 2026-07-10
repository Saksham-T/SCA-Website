'use strict';

/**
 * Newsletter model.
 * Stores newsletter email signups.
 */

const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
      maxlength: 254,
    },
    meta: {
      ip: { type: String, default: '' },
      userAgent: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Newsletter', newsletterSchema);
