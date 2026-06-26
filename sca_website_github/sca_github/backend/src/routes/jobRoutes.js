'use strict';

const express = require('express');
const { getLiveJobs } = require('../controllers/jobController');

const router = express.Router();

router.get('/', getLiveJobs);

module.exports = router;
