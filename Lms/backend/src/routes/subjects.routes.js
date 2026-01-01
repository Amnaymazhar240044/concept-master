// Import Router from Express for creating modular route handlers
import { Router } from 'express';

// Import authentication and authorization middlewares including optional auth
import { authenticate, authorize, authenticateOptional } from '../middlewares/auth.js';

// Import subject controller functions for managing academic subjects
import { createSubject, deleteSubject, listSubjects, updateSubject } from '../controllers/subjects.controller.js';

// Create a new Express router instance for subject routes
const router = Router();

// GET /subjects - Public/Optional auth endpoint to list all subjects
// Uses authenticateOptional to allow both authenticated and public access
// If authenticated, may return additional data or filtering options
// Returns: array of all subjects (Mathematics, Physics, Chemistry, etc.)
router.get('/', authenticateOptional, listSubjects);

// POST /subjects - Admin-only endpoint to create a new subject
// Requires: valid JWT token and admin role
// Accepts: subject name in request body
// Returns: newly created subject data
router.post('/', authenticate, authorize(['admin']), createSubject);

// PATCH /subjects/:id - Admin-only endpoint to update a subject
// Requires: valid JWT token and admin role
// Accepts: updated subject name in request body
router.patch('/:id', authenticate, authorize(['admin']), updateSubject);

// DELETE /subjects/:id - Admin-only endpoint to delete a subject
// Requires: valid JWT token and admin role
// Warning: This may affect chapters and content associated with this subject
router.delete('/:id', authenticate, authorize(['admin']), deleteSubject);

// Export router to be mounted in main application
export default router;
