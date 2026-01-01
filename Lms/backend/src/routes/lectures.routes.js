// Import Router from Express for creating modular route handlers
import { Router } from 'express';

// Import authentication and authorization middlewares
import { authenticate, authorize } from '../middlewares/auth.js';

// Import file upload middleware for handling video uploads
import { upload } from '../middlewares/upload.js';

// Import lecture controller functions for managing video lectures
import { approveLecture, createLecture, deleteLecture, getLecture, listLectures } from '../controllers/lectures.controller.js';

// Create a new Express router instance for lecture routes
const router = Router();

// GET /lectures - Protected endpoint to list all approved lectures
// Requires: valid JWT token
// Typically filtered by class_id, subject_id, and chapter_id via query parameters
// Returns: array of lectures (only approved ones visible to students)
router.get('/', listLectures);

// GET /lectures/:id - Protected endpoint to get a specific lecture
// Requires: valid JWT token
// Returns: single lecture object with title, description, video link/path
router.get('/:id', authenticate, getLecture);

// POST /lectures - Admin-only endpoint to create a new lecture
// Teacher role has been removed, only admin can create lectures now
// Requires: valid JWT token and admin role
// Accepts: multipart form data with video file and lecture metadata
// upload.single('video') processes the video file upload
router.post('/', authenticate, authorize(['admin']), upload.single('video'), createLecture);

// PATCH /lectures/:id/approve - Admin-only endpoint to approve a lecture
// Requires: valid JWT token and admin role
// Updates: lecture's approved status to true, making it visible to students
router.patch('/:id/approve', authenticate, authorize(['admin']), approveLecture);

// DELETE /lectures/:id - Protected endpoint to delete a lecture
// Requires: valid JWT token
// Removes lecture and associated video file from system
router.delete('/:id', authenticate, deleteLecture);

// Export router to be mounted in main application
export default router;
