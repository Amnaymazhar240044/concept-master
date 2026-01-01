// Import Router from Express for creating modular route handlers
import { Router } from 'express';

// Import authentication middleware for protecting routes
import { authenticate } from '../middlewares/auth.js';

// Import authentication controller functions for handling auth-related requests
import { login, me, register, getSignupRoles, updateProfile, changePassword, checkout } from '../controllers/auth.controller.js';

// Create a new Express router instance for authentication routes
const router = Router();

// GET /auth/signup-roles - Public endpoint to get available roles for registration
// Returns list of roles that can be selected during signup (student, admin)
router.get('/signup-roles', getSignupRoles);

// POST /auth/register - Public endpoint for user registration
// Accepts: name, email, password, role in request body
// Returns: new user data and JWT token
router.post('/register', register);

// POST /auth/login - Public endpoint for user authentication
// Accepts: email, password in request body
// Returns: user data and JWT token
router.post('/login', login);

// POST /auth/checkout - Public endpoint for payment processing (placeholder)
// Handles premium subscription checkout
router.post('/checkout', checkout);

// GET /auth/me - Protected endpoint to get current user profile
// Requires: valid JWT token via authenticate middleware
// Returns: current user data from token
router.get('/me', authenticate, me);

// PUT /auth/profile - Protected endpoint to update user profile
// Requires: valid JWT token
// Accepts: name, email, or other profile fields in request body
router.put('/profile', authenticate, updateProfile);

// PUT /auth/password - Protected endpoint to change user password
// Requires: valid JWT token
// Accepts: old password and new password in request body
router.put('/password', authenticate, changePassword);

// Export router to be mounted in main application
export default router;
