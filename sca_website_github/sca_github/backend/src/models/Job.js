'use strict';

/**
 * Job model.
 * Stores open roles/channels for the careers board.
 */

const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    ch: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    dept: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    loc: {
      type: String,
      required: true,
      trim: true,
    },
    exp: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    reqs: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ['Live', 'Closed'],
      default: 'Live',
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
