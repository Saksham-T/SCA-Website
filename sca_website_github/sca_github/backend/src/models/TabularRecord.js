'use strict';

/**
 * TabularRecord model.
 * Stores flat, key-value rows of database submissions.
 */

const mongoose = require('mongoose');

const tabularRecordSchema = new mongoose.Schema(
  {
    tableName: {
      type: String,
      required: true,
      index: true,
    },
    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TabularRecord', tabularRecordSchema);
