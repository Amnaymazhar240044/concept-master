// Import jsonwebtoken library for creating and verifying JWT tokens
import jwt from 'jsonwebtoken';

// Middleware function to authenticate users by verifying JWT tokens
// This is used for protected routes that require user authentication
export function authenticate(req, res, next) {
  // Extract Authorization header from request, default to empty string if not present
  const header = req.headers['authorization'] || '';

  // Check if header starts with 'Bearer ' prefix and extract token portion
  // If no Bearer prefix found, token is set to null
  const token = header.startsWith('Bearer ') ? header.substring(7) : null;

  // If no token provided, immediately return 401 Unauthorized response
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  // Attempt to verify and decode the JWT token
  try {
    // Verify token signature using secret key from environment variables
    // If verification succeeds, payload contains decoded user information
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user payload to request object for use in subsequent middleware
    // This makes user data available in route handlers
    req.user = payload;

    // Call next middleware function in the chain
    next();
  } catch (e) {
    // If token verification fails (expired, invalid signature, malformed), return 401
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Middleware function for optional authentication
// Allows requests to proceed even without valid authentication
// Used for routes where authentication enhances functionality but isn't required
export function authenticateOptional(req, res, next) {
  // Extract Authorization header from request
  const header = req.headers['authorization'] || '';

  // Extract token from Bearer header if present
  const token = header.startsWith('Bearer ') ? header.substring(7) : null;

  // If no token provided, continue without authentication
  if (!token) return next();

  // Attempt to verify token if one was provided
  try {
    // Verify and decode JWT token using secret key
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user payload to request for authenticated access
    req.user = payload;
  } catch (e) {
    // Silently ignore invalid tokens for optional authentication
    // Request continues without user information attached
  }

  // Continue to next middleware regardless of authentication result
  next();
}

// Higher-order function that creates authorization middleware for role-based access control
// Accepts array of allowed roles and returns middleware function
export function authorize(roles = []) {
  // Ensure roles parameter is always an array for consistent processing
  const allowed = Array.isArray(roles) ? roles : [roles];

  // Return middleware function that will be executed for each request
  return (req, res, next) => {
    // Check if user is authenticated (req.user should be set by authenticate middleware)
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    // If specific roles are required, verify user has one of the allowed roles
    if (allowed.length && !allowed.includes(req.user.role)) {
      // User role not in allowed list, return 403 Forbidden
      return res.status(403).json({ message: 'Forbidden' });
    }

    // User is authorized, proceed to next middleware
    next();
  };

  // Note: This unreachable next() call appears to be dead code
  next();
};


// Middleware function to enforce premium subscription requirement
// Used to restrict access to premium features like quizzes and AI chat
export function requirePremium(req, res, next) {
  // First check if user is authenticated at all
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  // Admins always have access to all features regardless of premium status
  // This bypasses premium check for administrative users
  if (req.user.role === 'admin') return next();

  // Check if user has premium subscription active
  if (!req.user.isPremium) {
    // User is not premium subscriber, deny access with 403 Forbidden
    return res.status(403).json({ message: 'Premium subscription required' });
  }

  // User is premium subscriber, allow access to feature
  next();
}

// Helper function to generate signed JWT tokens for authenticated users
// Called during login and registration to create access tokens
export function signToken(user) {
  // Create and sign JWT token with user information
  return jwt.sign(
    // Payload object containing essential user data to be encoded in token
    // Includes id, email, role for authorization, and isPremium for feature access
    { id: user.id, email: user.email, role: user.role, isPremium: user.isPremium },

    // Secret key used to sign the token, stored in environment variables
    process.env.JWT_SECRET,

    // Options object: set token expiration time (default 7 days)
    // Expired tokens will fail verification and require re-authentication
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// Create alias for backward compatibility with older code
// restrictTo is an older name for the authorize function
export const restrictTo = authorize;
