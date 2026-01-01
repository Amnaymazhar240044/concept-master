// Import Router from Express for creating modular route handlers
import { Router } from 'express';

// Import authentication and authorization middlewares
import { authenticate, authorize } from '../middlewares/auth.js';

// Import analytics controller functions for statistics and performance data
import { sloAccuracy, studentOverview, systemOverview, topicAccuracy } from '../controllers/analytics.controller.js';

// Create a new Express router instance for analytics routes
const router = Router();

// GET /analytics/student/overview - Student endpoint for personal performance overview
// Requires: valid JWT token and student role
// Returns: student's overall statistics including total attempts, average scores, and progress
router.get('/student/overview', authenticate, authorize(['student']), studentOverview);

// GET /analytics/student/slo-accuracy - Student endpoint for SLO-based performance
// SLO = Student Learning Outcome
// Requires: valid JWT token and student role
// Returns: accuracy breakdown by specific learning outcomes tagged on questions
router.get('/student/slo-accuracy', authenticate, authorize(['student']), sloAccuracy);

// GET /analytics/student/topic-accuracy - Student endpoint for topic-based performance
// Requires: valid JWT token and student role
// Returns: accuracy breakdown by subject topics showing strengths and weaknesses
router.get('/student/topic-accuracy', authenticate, authorize(['student']), topicAccuracy);

// GET /analytics/system/overview - Admin endpoint for system-wide analytics
// Requires: valid JWT token and admin role
// Returns: comprehensive system statistics including user counts, quiz metrics, and trends
router.get('/system/overview', authenticate, authorize(['admin']), systemOverview);

// Export router to be mounted in main application
export default router;
