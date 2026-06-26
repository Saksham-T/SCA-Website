'use strict';

const Job = require('../models/Job');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Fetch all job openings that are currently Live.
 */
const getLiveJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ status: 'Live' }).sort({ createdAt: 1 });
  
  return res.status(200).json({
    success: true,
    count: jobs.length,
    data: jobs,
  });
});

module.exports = { getLiveJobs };
