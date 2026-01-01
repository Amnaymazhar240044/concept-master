// Export utility function to calculate pagination parameters from query string
// Accepts query object and optional defaults for limit and maximum items per page
export function getPagination(query, defaults = { limit: 20, max: 100 }) {
  // Parse page number from query string, ensuring minimum value of 1
  // parseInt converts string to integer, Math.max ensures page is never less than 1
  const page = Math.max(1, parseInt(query.page || '1', 10));

  // Parse limit (items per page) from query string with default fallback
  // Ensure limit is at least 1 using Math.max
  let limit = Math.max(1, parseInt(query.limit || `${defaults.limit}`, 10));

  // Cap the limit to maximum allowed value to prevent excessive data retrieval
  // This protects server resources and prevents performance issues
  limit = Math.min(limit, defaults.max);

  // Calculate offset for database query: skip records from previous pages
  // Example: page 3 with limit 20 means offset 40 (skip first 2 pages of 20 items each)
  const offset = (page - 1) * limit;

  // Return object with calculated pagination parameters for use in database queries
  return { page, limit, offset };
}

// Export utility function to extract and validate search query parameters
// Accepts query object and array of field names to search within
export function getSearchFilter(query, fields = []) {
  // Extract search query string from query.q parameter and remove leading/trailing whitespace
  const q = (query.q || '').trim();

  // If no search query provided or no fields specified, return null (no filtering needed)
  if (!q || fields.length === 0) return null;

  // Return object containing search query and target fields for database text search
  return { q, fields };
}
