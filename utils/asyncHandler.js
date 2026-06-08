/**
 * Express async handler to eliminate try-catch boilerplate
 * @param {Function} fn - Async express route handler
 * @returns {Function} - Express middleware callback
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
