// Import Router from Express for creating modular route handlers
import { Router } from 'express';

// Import authentication and authorization middlewares including optional auth
import { authenticate, authorize, authenticateOptional } from '../middlewares/auth.js';

// Import file upload middleware for handling PDF/document uploads
import { upload } from '../middlewares/upload.js';

// Import note controller functions for managing study material notes
import { approveNote, createNote, deleteNote, getNote, getMyNotes, listNotes } from '../controllers/notes.controller.js';

// Create a new Express router instance for note routes
const router = Router();

// GET /notes - Public/Optional auth endpoint to list all approved notes
// Uses authenticateOptional to allow both public and authenticated access
// Public users can only see approved notes
// Returns: array of approved notes filterable by class, subject, and chapter
router.get('/', authenticateOptional, listNotes);

// GET /notes/my-notes - Admin-only endpoint to view notes uploaded by current admin
// Teacher role has been removed, only admin can upload notes now
// Requires: valid JWT token and admin role
// Returns: array of notes created by the current admin (both approved and pending)
router.get('/my-notes', authenticate, authorize(['admin']), getMyNotes);

// GET /notes/:id - Public/Optional auth endpoint to get a specific note
// Uses authenticateOptional for flexible access
// Returns: single note object with file path and metadata
router.get('/:id', authenticateOptional, getNote);

// POST /notes - Admin-only endpoint to upload a new note
// Requires: valid JWT token and admin role
// Accepts: multipart form data with note file (PDF) and metadata
// upload.single('note') processes the file upload
// Created notes default to unapproved status
router.post('/', authenticate, authorize(['admin']), upload.single('note'), createNote);

// DELETE /notes/:id - Protected endpoint to delete a note
// Requires: valid JWT token
// Removes note and associated file from system
router.delete('/:id', authenticate, deleteNote);

// PATCH /notes/:id/approve - Admin-only endpoint to approve a note
// Requires: valid JWT token and admin role
// Updates: note's approved status to true, making it publicly visible
router.patch('/:id/approve', authenticate, authorize(['admin']), approveNote);

// Export router to be mounted in main application
export default router;
