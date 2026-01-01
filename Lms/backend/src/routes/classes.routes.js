// Import Router from Express for creating modular route handlers
import { Router } from 'express';

// Import authentication and authorization middlewares
import { authenticate, authorize } from '../middlewares/auth.js';

// Import class controller functions for managing academic grade levels
import { createClass, deleteClass, listClasses, updateClass, getClass } from '../controllers/classes.controller.js';

// Create a new Express router instance for class routes
const router = Router();

// Public routes - anyone can view classes without authentication
// These are public because class information is needed during registration

// GET /classes - Public endpoint to list all classes
// Returns: array of all class levels (Class 9, 10, 11, 12)
router.get('/', listClasses);

// GET /classes/:id - Public endpoint to get a specific class
// Returns: single class object with title and id
router.get('/:id', getClass);

// Admin routes - require authentication and admin role
// Only admins can create, update, or delete class definitions

// POST /classes - Admin-only endpoint to create a new class
// Requires: valid JWT token and admin role
// Accepts: class title in request body
router.post('/', authenticate, authorize(['admin']), createClass);

// PATCH /classes/:id - Admin-only endpoint to update a class
// Requires: valid JWT token and admin role
// Accepts: updated class data in request body
router.patch('/:id', authenticate, authorize(['admin']), updateClass);

// DELETE /classes/:id - Admin-only endpoint to delete a class
// Requires: valid JWT token and admin role
// Warning: This may affect students enrolled in this class
router.delete('/:id', authenticate, authorize(['admin']), deleteClass);

// Export router to be mounted in main application
export default router;
