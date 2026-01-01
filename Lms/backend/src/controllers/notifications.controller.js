// Import async handler wrapper for error handling
import { asyncHandler } from '../utils/asyncHandler.js';

// Import pagination utility
import { getPagination } from '../utils/pagination.js';

// Import Notification model
import { Notification } from '../models/index.js';

// Controller function to create a new notification
// Admin/Teacher endpoint for sending announcements to users
export const createNotification = asyncHandler(async (req, res) => {
  // Destructure notification data from request body
  const { title, message, type, to_user_id, to_role } = req.body;

  // Create new notification document in database
  // Notification can be targeted to specific user OR entire role
  const note = await Notification.create({
    title,                           // Notification headline
    message,                         // Notification content
    type,                            // Notification category (e.g., 'note', 'lecture', 'quiz')
    to_user_id: to_user_id || null,  // Optional: Specific user ID for targeted notification
    to_role: to_role || null,        // Optional: Role for broadcast notification (e.g., 'student')
    created_by: req.user.id          // Admin/Teacher who created the notification
  });

  // Return created notification with 201 Created status
  res.status(201).json(note);
});

// Controller function to list notifications for current user
// Protected endpoint for users to view their notifications
export const listMyNotifications = asyncHandler(async (req, res) => {
  // Extract pagination parameters
  const { page, limit, offset } = getPagination(req.query);

  // Build filter to get notifications for this specific user
  // User receives notifications if:
  // 1. They are specifically targeted (to_user_id matches), OR
  // 2. Their role is targeted (to_role matches)
  const where = {
    $or: [
      { to_user_id: req.user.id },    // Notifications targeted to this user
      { to_role: req.user.role }      // Notifications broadcast to user's role
    ]
  };

  // Count total notifications matching filter (for pagination metadata)
  const total = await Notification.countDocuments(where);

  // Query notifications with filter, sorting, and pagination
  const notifications = await Notification.find(where)
    .sort({ _id: -1 })       // Sort by newest first
    .skip(offset)            // Skip records for pagination
    .limit(limit);           // Limit results per page

  // Return paginated response with metadata
  res.json({ total, page, limit, data: notifications });
});

// Controller function to mark a notification as read
// Protected endpoint for users to update read status
export const markRead = asyncHandler(async (req, res) => {
  // Find notification by ID from URL parameters
  const n = await Notification.findById(req.params.id);

  // Return 404 if notification not found
  if (!n) return res.status(404).json({ message: 'Not found' });

  // Authorization check - user can only mark their own notifications as read
  // If notification is targeted to specific user
  if (n.to_user_id && n.to_user_id.toString() !== req.user.id) {
    // Verify current user is the targeted user
    return res.status(403).json({ message: 'Forbidden' });
  }

  // If notification is targeted to a role
  if (n.to_role && n.to_role !== req.user.role) {
    // Verify current user has the targeted role
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Update read status to true
  n.is_read = true;

  // Save updated notification to database
  await n.save();

  // Return updated notification data
  res.json(n);
});
