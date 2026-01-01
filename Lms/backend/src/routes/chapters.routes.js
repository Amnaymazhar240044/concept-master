// Import Router from Express for creating modular route handlers
import { Router } from 'express';

// Import authentication and authorization middlewares
import { authenticate, authorize } from '../middlewares/auth.js';

// Import chapter controller functions for managing book chapters
import { createChapter, listChapters, updateChapter, deleteChapter } from '../controllers/chapters.controller.js';

// Create a new Express router instance for chapter routes
const router = Router();

// GET /chapters - Protected endpoint to list all chapters
// Requires: valid JWT token
// Typically filtered by class_id and subject_id via query parameters
// Returns: array of chapters organized by subject and class
router.get('/', authenticate, listChapters);

// POST /chapters - Admin-only endpoint to create a new chapter
// Requires: valid JWT token and admin role
// Accepts: title, subject_id, class_id, and optional order in request body
// Returns: newly created chapter data
router.post('/', authenticate, authorize(['admin']), createChapter);

// PUT /chapters/:id - Admin-only endpoint to update a chapter
// Requires: valid JWT token and admin role
// Accepts: updated chapter data (title, order, etc.) in request body
router.put('/:id', authenticate, authorize(['admin']), updateChapter);

// DELETE /chapters/:id - Admin-only endpoint to delete a chapter
// Requires: valid JWT token and admin role
// Warning: This may affect lectures and notes associated with this chapter
router.delete('/:id', authenticate, authorize(['admin']), deleteChapter);

// Export router to be mounted in main application
export default router;
