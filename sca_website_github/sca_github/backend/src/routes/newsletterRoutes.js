'use strict';

const express = require('express');
const { subscribeNewsletter } = require('../controllers/newsletterController');
const { applicationLimiter } = require('../middleware/rateLimiter');
const { mongoGuard } = require('../middleware/sanitize');

const router = express.Router();

router.post('/', applicationLimiter, mongoGuard, subscribeNewsletter);

module.exports = router;
