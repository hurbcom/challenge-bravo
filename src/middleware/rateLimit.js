const { requests } = require('../config/index');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

const limiter = rateLimit({
  windowMs: requests.rateLimit.window,
  max: requests.rateLimit.max,
});

const slower = slowDown({
  windowMs: requests.slowDown.window,
  delayAfter: requests.slowDown.delayAfter,
  delayMs: requests.slowDown.delayMs,
});

module.exports = [
  slower,
  limiter,
];