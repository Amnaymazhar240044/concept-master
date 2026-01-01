// Import bcrypt library for password hashing when creating users
import bcrypt from 'bcryptjs';

// Import async handler wrapper for error handling
import { asyncHandler } from '../utils/asyncHandler.js';

// Import pagination utility for listing users
import { getPagination } from '../utils/pagination.js';

// Import all necessary models for admin operations
import { ActivityLog, Role, Subject, Class, User, Note, Lecture, Quiz } from '../models/index.js';

// Import JWT token signing function for generating new tokens
import { signToken } from '../middlewares/auth.js';

// Controller function to list all users with pagination
// Admin-only endpoint for viewing and managing system users
export const listUsers = asyncHandler(async (req, res) => {
  // Extract pagination parameters from query string
  const { page, limit, offset } = getPagination(req.query);

  // Count total number of users in database
  const total = await User.countDocuments();

  // Query users with pagination
  const users = await User.find()
    .sort({ _id: -1 })       // Sort by newest first (descending _id)
    .skip(offset)            // Skip records for pagination
    .limit(limit);           // Limit results per page

  // Return paginated response with metadata
  res.json({ total, page, limit, data: users });
});

// Controller function to create a new user
// Admin-only endpoint for manually creating user accounts
export const createUser = asyncHandler(async (req, res) => {
  // Destructure user data from request body
  const { name, email, password, role } = req.body;

  // Role validation is handled by User model enum
  // Legacy code: Role collection validation (commented out)
  // const roleRow = await Role.findOne({ role_name: role });
  // if (!roleRow) return res.status(400).json({ message: 'Invalid role' });

  // Check if email already exists in database
  const exists = await User.findOne({ email });

  // Return 409 Conflict if email is already in use
  if (exists) return res.status(409).json({ message: 'Email already in use' });

  // Hash password using bcrypt with salt rounds of 10
  const hashed = await bcrypt.hash(password, 10);

  // Create new user document in database
  const user = await User.create({ name, email, password: hashed, role });

  // Log admin action to ActivityLog for audit trail
  await ActivityLog.create({
    user_id: req.user.id,           // Admin who performed the action
    action: 'create_user',          // Type of action
    meta: { target: user._id }      // Target user ID
  });

  // Return 201 Created with new user data
  res.status(201).json(user);
});

// Controller function to update a user's role
// Admin-only endpoint for changing user permissions
export const updateUserRole = asyncHandler(async (req, res) => {
  // Extract new role from request body
  const { role } = req.body;

  // Find user by ID from URL parameters
  const user = await User.findById(req.params.id);

  // Return 404 if user not found
  if (!user) return res.status(404).json({ message: 'Not found' });

  // Role validation is handled by User model enum
  // Legacy code: Role collection validation (commented out)
  // const roleRow = await Role.findOne({ role_name: role });
  // if (!roleRow) return res.status(400).json({ message: 'Invalid role' });

  // Update user's role
  user.role = role;

  // Save updated user to database
  await user.save();

  // Log admin action to ActivityLog for audit trail
  await ActivityLog.create({
    user_id: req.user.id,                       // Admin who performed the action
    action: 'update_role',                      // Type of action
    meta: { target: user._id, role }            // Target user and new role
  });

  // Return updated user data
  res.json(user);
});

// Controller function to delete a user
// Admin-only endpoint for removing user accounts
export const deleteUser = asyncHandler(async (req, res) => {
  // Find user by ID from URL parameters
  const user = await User.findById(req.params.id);

  // Return 404 if user not found
  if (!user) return res.status(404).json({ message: 'Not found' });

  // Delete user document from database
  await user.deleteOne();

  // Log admin action to ActivityLog for audit trail
  await ActivityLog.create({
    user_id: req.user.id,           // Admin who performed the action
    action: 'delete_user',          // Type of action
    meta: { target: user._id }      // Target user ID
  });

  // Return success message
  res.json({ message: 'Deleted' });
});

// Controller function to toggle user's premium status
// Admin-only endpoint for managing premium subscriptions
export const togglePremium = asyncHandler(async (req, res) => {
  // Find user by ID from URL parameters
  const user = await User.findById(req.params.id);

  // Return 404 if user not found
  if (!user) return res.status(404).json({ message: 'Not found' });

  // Toggle premium status (true becomes false, false becomes true)
  user.isPremium = !user.isPremium;

  // Save updated user to database
  await user.save();

  // Log admin action to ActivityLog for audit trail
  await ActivityLog.create({
    user_id: req.user.id,                               // Admin who performed the action
    action: 'toggle_premium',                           // Type of action
    meta: { target: user._id, isPremium: user.isPremium }  // Target user and new premium status
  });

  // Generate new JWT token with updated isPremium status
  // This allows the affected user to refresh their session and see updated premium access
  // If they're currently logged in, they can use this token to update their client state
  const token = signToken({
    id: user._id,
    email: user.email,
    role: user.role,
    isPremium: user.isPremium
  });

  // Return updated user data with new token
  res.json({
    user,                                    // Updated user object
    token,                                   // New JWT token with updated isPremium
    message: 'Premium status updated successfully'
  });
});



// Controller function to list available roles
// Admin/Public endpoint for populating role selection dropdowns
export const listRoles = asyncHandler(async (req, res) => {
  // Return static list of roles
  // Moving away from dynamic Role collection to simplify system
  // Only student and admin roles remain (teacher and parent removed)
  const roles = [
    { id: 'student', role_name: 'student' },
    { id: 'admin', role_name: 'admin' }
  ];

  res.json(roles);
});

// Controller function to list all subjects
// Admin endpoint for viewing available subjects
export const listSubjects = asyncHandler(async (req, res) => {
  // Query all subjects from database
  const subjects = await Subject.find();

  // Return subjects array
  res.json(subjects);
});

// Controller function to list all classes
// Admin endpoint for viewing available grade levels
export const listClasses = asyncHandler(async (req, res) => {
  // Query all classes from database
  const classes = await Class.find();

  // Return classes array
  res.json(classes);
});


// Controller function to get recent system activity
// Added for Admin Dashboard to replace Teacher Dashboard functionality
// Fetches recent uploads (Notes, Lectures, Quizzes) system-wide for admin review
export const getRecentActivity = asyncHandler(async (req, res) => {
  // Fetch recent items from different collections (system-wide)
  // Since admins manage everything, we show system-wide recent uploads
  // This gives admins visibility into all content creation activity

  // Query 5 most recent notes
  const notes = await Note.find()
    .sort({ createdAt: -1 })      // Sort by newest first
    .limit(5)                     // Limit to 5 results
    .select('title createdAt')    // Only select needed fields
    .lean();                      // Return plain JavaScript objects (faster)

  // Query 5 most recent lectures
  const lectures = await Lecture.find()
    .sort({ createdAt: -1 })      // Sort by newest first
    .limit(5)                     // Limit to 5 results
    .select('title createdAt')    // Only select needed fields
    .lean();                      // Return plain JavaScript objects

  // Query 5 most recent quizzes
  const quizzes = await Quiz.find()
    .sort({ createdAt: -1 })      // Sort by newest first
    .limit(5)                     // Limit to 5 results
    .select('title createdAt')    // Only select needed fields
    .lean();                      // Return plain JavaScript objects

  // Combine and format activity from all sources
  // Map each collection to a consistent activity format
  const activity = [
    // Format notes as activity items
    ...notes.map(n => ({
      type: 'notes',                                        // Activity type
      action: 'Uploaded Note',                              // Action description
      item: n.title,                                        // Item title
      time: new Date(n.createdAt).toLocaleDateString(),    // Formatted date
      timestamp: new Date(n.createdAt)                      // Date object for sorting
    })),

    // Format lectures as activity items
    ...lectures.map(l => ({
      type: 'lecture',                                      // Activity type
      action: 'Uploaded Lecture',                           // Action description
      item: l.title,                                        // Item title
      time: new Date(l.createdAt).toLocaleDateString(),    // Formatted date
      timestamp: new Date(l.createdAt)                      // Date object for sorting
    })),

    // Format quizzes as activity items
    ...quizzes.map(q => ({
      type: 'quiz',                                         // Activity type
      action: 'Created Quiz',                               // Action description
      item: q.title,                                        // Item title
      time: new Date(q.createdAt).toLocaleDateString(),    // Formatted date
      timestamp: new Date(q.createdAt)                      // Date object for sorting
    }))
  ];

  // Sort all activity by timestamp descending (newest first)
  // This ensures most recent activity from any source appears at top
  activity.sort((a, b) => b.timestamp - a.timestamp);

  // Take top 10 most recent activities across all types
  const recentActivity = activity.slice(0, 10);

  // Return combined recent activity array
  res.json(recentActivity);
});
