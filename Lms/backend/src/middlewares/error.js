// Middleware function to handle 404 Not Found errors
// This catches all requests to undefined routes after all other route handlers
export function notFound(req, res, next) {
  // Set HTTP status code to 404 to indicate resource not found
  res.status(404);

  // Create new Error object and pass to next error handling middleware
  // Express recognizes errors passed to next() and triggers error handler
  next(new Error('Not Found'));
}

// Global error handling middleware for all unhandled errors in the application
// Express identifies error handlers by the 4-parameter signature (err, req, res, next)
export function errorHandler(err, req, res, next) {
  // Log detailed error information to console for debugging
  console.error('Error Handler Caught:', {
    // Log the error message describing what went wrong
    message: err.message,

    // Log the stack trace showing where the error originated
    stack: err.stack,

    // Log the request URL to identify which endpoint caused the error
    url: req.url,

    // Log the HTTP method (GET, POST, etc.) for additional context
    method: req.method
  });

  // Determine appropriate HTTP status code for the error response
  // If status code is 200 (success), default to 500 (internal server error)
  // Otherwise use the status code already set on the response object
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Send JSON error response to client with appropriate status code
  res.status(statusCode).json({
    // Include error message in response, fallback to generic message if none provided
    message: err.message || 'Server Error',
  });
}
