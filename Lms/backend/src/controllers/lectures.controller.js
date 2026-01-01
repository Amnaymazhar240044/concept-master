// Import async handler wrapper for error handling in async route handlers
import { asyncHandler } from '../utils/asyncHandler.js';

// Import fs module for file system operations (deleting video files)
import fs from 'fs';

// Import path module for file path operations
import path from 'path';

// Import pagination utility for listing lectures with pagination
import { getPagination } from '../utils/pagination.js';

// Import models for database operations
import { Lecture, Subject, Class, User, Notification } from '../models/index.js';

// Controller function to create a new lecture
// Admin-only endpoint for uploading video lectures (file or link)
export const createLecture = asyncHandler(async (req, res) => {
  // Destructure lecture data from request body
  const { title, description, subject_id, class_id, chapter_id, type, link, isPremium } = req.body;

  // Validate lecture type - must be either 'file' or 'link'
  if (!['file', 'link'].includes(type)) return res.status(400).json({ message: 'Invalid type' });

  // Initialize file path and link variables
  let file_path = null;
  let url_link = null;

  // Handle file upload type - video file uploaded via multer
  if (type === 'file') {
    // Ensure video file was actually uploaded
    if (!req.file) return res.status(400).json({ message: 'Video file is required' });

    // Store relative path to uploaded video file
    file_path = `/uploads/videos/${req.file.filename}`;
  }
  // Handle link type - external video URL (e.g., YouTube)
  else if (type === 'link') {
    // Ensure link was provided in request body
    if (!link) return res.status(400).json({ message: 'Video link is required' });

    // Store the provided video link
    url_link = link;
  }

  // Create new lecture document in database
  const lecture = await Lecture.create({
    title,                           // Lecture title
    description,                     // Lecture description
    subject_id: subject_id || null,  // Optional subject reference
    class_id: class_id || null,      // Optional class reference
    chapter_id: chapter_id || null,  // Optional chapter reference
    type,                            // Type: 'file' or 'link'
    file_path,                       // Path to uploaded video file (if type='file')
    link: url_link,                  // External video link (if type='link')
    uploaded_by: req.user.id,        // Current admin user ID
    approved: true,                  // Auto-approve lectures (no moderation needed)
    isPremium: isPremium === true || isPremium === 'true' // Premium access control
  });

  // Send notification to all students about new lecture
  await Notification.create({
    title: 'New Lecture',                       // Notification title
    message: `${title} is now available`,      // Notification message
    type: 'lecture',                           // Notification type
    to_role: 'student',                        // Broadcast to all students
    created_by: req.user.id                    // Admin who created the lecture
  });

  // Return created lecture with 201 Created status
  res.status(201).json(lecture);
});

// Controller function to list lectures with filtering and pagination
// Used by students and admins to browse lectures
export const listLectures = asyncHandler(async (req, res) => {
  // Extract pagination parameters (page, limit, offset)
  const { page, limit, offset } = getPagination(req.query);

  // Build filter object for database query
  const where = {};

  // Add subject filter if provided
  if (req.query.subject_id) where.subject_id = req.query.subject_id;

  // Add class filter if provided
  if (req.query.class_id) where.class_id = req.query.class_id;

  // Add chapter filter if provided
  if (req.query.chapter_id) where.chapter_id = req.query.chapter_id;

  // Filter by approval status based on user role
  // Students, parents, and guests (unauthenticated) can only see approved lectures
  if (!req.user || req.user.role === 'student' || req.user.role === 'parent') {
    where.approved = true;
  }
  // Admins can optionally filter by approval status
  else if (req.query.approved !== undefined) {
    where.approved = req.query.approved === 'true';
  }

  // Filter by premium status based on user's premium subscription
  // Non-logged-in users and non-premium users can only see free lectures
  if (!req.user || !req.user.isPremium) {
    where.isPremium = false;
  }
  // Premium users can see all lectures (both free and premium)
  // No additional filter needed for premium users

  // Count total lectures matching filter (for pagination metadata)
  const total = await Lecture.countDocuments(where);

  // Query lectures with filter, population, sorting, and pagination
  const lectures = await Lecture.find(where)
    .populate('subject_id')               // Populate subject details
    .populate('class_id')                 // Populate class details
    .populate('chapter_id')               // Populate chapter details
    .populate('uploaded_by', 'id name')   // Populate uploader name/ID
    .sort({ _id: -1 })                    // Sort by newest first
    .skip(offset)                         // Skip records for pagination
    .limit(limit);                        // Limit results per page

  // Return paginated response with metadata
  res.json({ total, page, limit, data: lectures });
});

// Controller function to approve or unapprove a lecture
// Admin-only endpoint for controlling lecture visibility
export const approveLecture = asyncHandler(async (req, res) => {
  // Find lecture by ID from URL parameters
  const lecture = await Lecture.findById(req.params.id);

  // Return 404 if lecture not found
  if (!lecture) return res.status(404).json({ message: 'Not found' });

  // Update approval status from request body
  // Convert string 'true' to boolean true
  lecture.approved = req.body.approved === true || req.body.approved === 'true';

  // Save updated lecture to database
  await lecture.save();

  // Return updated lecture data
  res.json(lecture);
});

// Controller function to get a single lecture by ID
// Protected endpoint with visibility based on approval status
export const getLecture = asyncHandler(async (req, res) => {
  // Find lecture by ID and populate related data
  const lecture = await Lecture.findById(req.params.id)
    .populate('subject_id')               // Populate subject details
    .populate('class_id')                 // Populate class details
    .populate('chapter_id')               // Populate chapter details
    .populate('uploaded_by', 'id name');  // Populate uploader name/ID

  // Return 404 if lecture not found
  if (!lecture) return res.status(404).json({ message: 'Not found' });

  // Check if user has permission to view unapproved lecture
  // Students and parents can only view approved lectures
  if (!lecture.approved && (req.user?.role === 'student' || req.user?.role === 'parent')) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Return lecture data
  res.json(lecture);
});

// Controller function to delete a lecture
// Protected endpoint - owner or admin can delete
export const deleteLecture = asyncHandler(async (req, res) => {
  // Find lecture by ID from URL parameters
  const lecture = await Lecture.findById(req.params.id);

  // Return 404 if lecture not found
  if (!lecture) return res.status(404).json({ message: 'Not found' });

  // Check if current user is the lecture owner
  const isOwner = lecture.uploaded_by.toString() === req.user.id;

  // Check if current user is admin
  const isAdmin = req.user.role === 'admin';

  // Only owner or admin can delete - return 403 otherwise
  if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Forbidden' });

  // Delete lecture document from database
  await lecture.deleteOne();

  // Attempt to delete associated video file
  try {
    // Only delete file if lecture type is 'file' and file_path exists
    if (lecture.type === 'file' && lecture.file_path) {
      // Remove leading slash from path
      const relPath = lecture.file_path.replace(/^\//, '');

      // Construct full file path
      const fullPath = path.join(process.cwd(), relPath);

      // Delete file if it exists on file system
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }
  } catch {
    // Silently catch file deletion errors
    // File might already be deleted or path might be invalid
  }

  // Return success message confirming deletion
  res.json({ message: 'Deleted' });
});
