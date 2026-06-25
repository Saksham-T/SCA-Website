'use strict';

/**
 * Operational error carrying an HTTP status code and optional structured field
 * errors. Anything thrown as an ApiError is considered "expected" by the
 * centralized error handler and surfaced to the client; everything else is
 * treated as an unexpected 500.
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode HTTP status code.
   * @param {string} message    Human-readable summary.
   * @param {Array<{field:string,message:string}>} [errors] Field-level details.
   */
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }

  static tooManyRequests(message) {
    return new ApiError(429, message);
  }

  static internal(message = 'Internal server error') {
    return new ApiError(500, message);
  }
}

module.exports = ApiError;
