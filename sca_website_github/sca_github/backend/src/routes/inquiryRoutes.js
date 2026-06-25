'use strict';

const express = require('express');
const { submitInquiry } = require('../controllers/inquiryController');
const { applicationLimiter } = require('../middleware/rateLimiter');
const { mongoGuard } = require('../middleware/sanitize');

const router = express.Router();

router.post('/', applicationLimiter, mongoGuard, submitInquiry);

module.exports = router;
