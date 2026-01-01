// Import Joi library for declarative validation of JavaScript objects
// Joi provides powerful schema description and data validation capabilities
import Joi from 'joi';

// Define and export validation schema for user registration endpoint
// This schema validates the request body for user sign-up requests
export const registerSchema = Joi.object({
  // Name field: must be a string between 2-120 characters, required for registration
  name: Joi.string().min(2).max(120).required(),

  // Email field: must be a valid email format, required and serves as unique identifier
  email: Joi.string().email().required(),

  // Password field: must be string with minimum 6 characters for security, max 120 for storage
  password: Joi.string().min(6).max(120).required(),

  // Role field: must be one of three allowed roles, determines user permissions in system
  // Note: 'teacher' role is legacy and has been migrated to 'admin' role
  role: Joi.string().valid('student', 'teacher', 'admin').required(),
});

// Define and export validation schema for user login endpoint
// This schema validates the request body for authentication requests
export const loginSchema = Joi.object({
  // Email field: must be a valid email format for user identification
  email: Joi.string().email().required(),

  // Password field: must match registration constraints for verification
  password: Joi.string().min(6).max(120).required(),
});
