// Import Router from Express for creating modular route handlers
import { Router } from 'express';

// Import authentication and authorization middlewares for access control
import { authenticate, authorize } from '../middlewares/auth.js';

// Import results controller functions for handling quiz results and attempts
import { getAttempt, getAttemptDetails, listStudentAttempts } from '../controllers/results.controller.js';

// Create a new Express router instance for results routes
const router = Router();

// GET /results/attempts/:id - Protected endpoint to get a specific quiz attempt
// Requires: valid JWT token
// Returns: attempt data including score, percentage, and timestamp
router.get('/attempts/:id', authenticate, getAttempt);

// GET /results/attempts/:id/details - Protected endpoint to get detailed attempt results
// Requires: valid JWT token
// Returns: attempt with complete question-by-question breakdown and AI feedback
router.get('/attempts/:id/details', authenticate, getAttemptDetails);

// GET /results/students/me/attempts - Student endpoint to view their own quiz attempts
// Requires: valid JWT token and student role
// Returns: list of all quiz attempts made by the current student
router.get('/students/me/attempts', authenticate, authorize(['student']), listStudentAttempts);

// GET /results/students/:studentId/attempts - Admin/Teacher endpoint to view a student's attempts
// Requires: valid JWT token and teacher, admin, or parent role
// Note: Teacher and parent roles are legacy and have been removed in current system
// Returns: list of all quiz attempts for the specified student
router.get('/students/:studentId/attempts', authenticate, authorize(['teacher', 'admin', 'parent']), listStudentAttempts);

// Export router to be mounted in main application
export default router;
