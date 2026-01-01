// Import Router from Express for creating modular route handlers
import { Router } from 'express';

// Import authentication and authorization middlewares
import { authenticate, authorize } from '../middlewares/auth.js';

// Import notification controller functions for managing user alerts and announcements
import { createNotification, listMyNotifications, markRead } from '../controllers/notifications.controller.js';

// Create a new Express router instance for notification routes
const router = Router();

// GET /notifications/me - Protected endpoint for users to view their notifications
// Requires: valid JWT token
// Returns: array of notifications targeted to the current user or their role
router.get('/me', authenticate, listMyNotifications);

// POST /notifications - Admin/Teacher endpoint to create a new notification
// Requires: valid JWT token and teacher or admin role
// Note: Teacher role is legacy and has been migrated to admin
// Accepts: title, message, type, and targeting info (to_user_id or to_role)
// Creates broadcast or targeted notifications
router.post('/', authenticate, authorize(['teacher', 'admin']), createNotification);

// PATCH /notifications/:id/read - Protected endpoint to mark notification as read
// Requires: valid JWT token
// Updates: notification's is_read status to true
router.patch('/:id/read', authenticate, markRead);

// Export router to be mounted in main application
export default router;
