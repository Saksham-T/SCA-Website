'use strict';

/**
 * Wraps an async Express handler so any rejected promise is forwarded to
 * `next()` and handled by the centralized error middleware. Avoids try/catch
 * boilerplate in every controller and guarantees no unhandled rejections crash
 * the process.
 *
 * @param {Function} fn async (req, res, next) => {...}
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
