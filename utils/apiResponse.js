class ApiResponse {
  /**
   * Send a success response
   * @param {object} res - Express response object
   * @param {string} message - Response message
   * @param {any} data - Response payload data
   * @param {number} statusCode - HTTP status code (default 200)
   */
  static success(res, message, data = null, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  /**
   * Send a paginated success response
   * @param {object} res - Express response object
   * @param {string} message - Response message
   * @param {any} data - Response payload array/data
   * @param {object} pagination - Pagination metadata
   * @param {number} statusCode - HTTP status code (default 200)
   */
  static paginated(res, message, data, pagination, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      pagination,
      data
    });
  }
}

module.exports = ApiResponse;
