// Export a higher-order function that wraps async route handlers to catch errors
// This eliminates the need for try-catch blocks in every async controller function
export const asyncHandler = (fn) => (req, res, next) => {
  // Perform a type check to ensure 'next' is a valid Express middleware function
  // This debugging check helps identify routing configuration issues
  if (typeof next !== 'function') {
    // Log error message indicating 'next' is not properly passed to the middleware
    console.error('asyncHandler: next is not a function!', next);

    // Log the request URL to help identify which route has the configuration issue
    console.error('req.url:', req.url);

    // Log the HTTP method (GET, POST, etc.) for additional debugging context
    console.error('req.method:', req.method);
  }

  // Execute the wrapped async function and convert its result to a Promise
  // If the promise resolves successfully, nothing happens (normal flow continues)
  // If the promise rejects (async function throws error), catch it and pass to Express error handler
  // The 'next' function forwards errors to Express's error handling middleware
  Promise.resolve(fn(req, res, next)).catch(next);
};
