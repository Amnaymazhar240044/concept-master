// Import Router from Express for creating modular route handlers
import { Router } from 'express';

// Import authentication and authorization middlewares for admin access control
import { authenticate, authorize } from '../middlewares/auth.js';

// Import admin controller functions for user and system management
import { createUser, deleteUser, listClasses, listRoles, listSubjects, listUsers, updateUserRole, getRecentActivity, togglePremium } from '../controllers/admin.controller.js';

// Import results controller function for viewing all quiz attempts
import { getAllAttempts } from '../controllers/results.controller.js';

// Import analytics controller function for admin dashboard statistics
import { getAdminAnalytics } from '../controllers/analytics.controller.js';

// Create a new Express router instance for admin routes
const router = Router();

// Apply authentication and admin authorization to ALL routes in this router
// All admin routes require valid JWT token and admin role
router.use(authenticate, authorize(['admin']));

// GET /admin/users - List all users in the system
// Returns: array of all users with their roles and details
router.get('/users', listUsers);

// POST /admin/users - Create a new user account
// Accepts: name, email, password, role in request body
// Returns: newly created user data
router.post('/users', createUser);

// PATCH /admin/users/:id/role - Update a user's role
// Accepts: new role in request body
// Updates: user's role (student/admin)
router.patch('/users/:id/role', updateUserRole);

// PATCH /admin/users/:id/premium - Toggle a user's premium subscription status
// Accepts: isPremium boolean in request body
// Updates: user's premium access for quizzes and AI features
router.patch('/users/:id/premium', togglePremium);

// DELETE /admin/users/:id - Delete a user account
// Permanently removes user and their associated data
router.delete('/users/:id', deleteUser);


// GET /admin/roles - List all available user roles
// Returns: array of role definitions
router.get('/roles', listRoles);

// GET /admin/subjects - List all subjects in the system
// Returns: array of subjects (Math, Physics, etc.)
router.get('/subjects', listSubjects);

// GET /admin/classes - List all class levels
// Returns: array of classes (9, 10, 11, 12)
router.get('/classes', listClasses);

// GET /admin/dashboard/activity - Get recent system activity for admin dashboard
// This route migrated from teacher role when teacher functionality moved to admin
// Returns: recent user actions, quiz attempts, and system events
router.get('/dashboard/activity', getRecentActivity);

// GET /admin/attempts - View all quiz attempts across all students
// New analytics and attempts routes for comprehensive monitoring
// Returns: paginated list of all quiz attempts system-wide
router.get('/attempts', getAllAttempts);

// GET /admin/analytics/dashboard - Get comprehensive dashboard analytics
// Returns: statistics including total users, quizzes, attempts, and trends
router.get('/analytics/dashboard', getAdminAnalytics);

// Export router to be mounted in main application
export default router;
