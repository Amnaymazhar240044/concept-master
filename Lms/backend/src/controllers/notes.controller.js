// Import fs module for file system operations (deleting note files)
import fs from 'fs';

// Import path module for file path operations
import path from 'path';

// Import async handler wrapper for error handling
import { asyncHandler } from '../utils/asyncHandler.js';

// Import pagination utility
import { getPagination } from '../utils/pagination.js';

// Import models for database operations
import { Note, Subject, Class, User, Notification } from '../models/index.js';
import { checkFeatureAccess } from './featureControl.controller.js';

// Controller function to create a new note
// Admin-only endpoint for uploading study material PDFs
export const createNote = asyncHandler(async (req, res) => {
  // REMOVED: File requirement check - file is now optional
  // if (!req.file) return res.status(400).json({ message: 'Note file is required' });

  // Destructure note metadata from request body
  const { title, description, subject_id, class_id, chapter_id } = req.body;

  // Validate required fields
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  // Prepare note data
  const noteData = {
    title,                           // Note title
    description,                     // Note description
    subject_id: subject_id || null,  // Optional subject reference
    class_id: class_id || null,      // Optional class reference
    chapter_id: chapter_id || null,  // Optional chapter reference
    uploaded_by: req.user.id,        // Current admin user ID
    approved: true,                  // Auto-approve notes (no moderation needed)
    // Add field to identify descriptive notes
    is_descriptive_only: !req.file   // true if no file uploaded
  };

  // Add file data only if file exists
  if (req.file) {
    // Construct file path to uploaded note
    const filePath = `/uploads/notes/${req.file.filename}`;
    noteData.file_path = filePath;             // Path to uploaded PDF/file
    noteData.file_name = req.file.originalname;  // Original filename for display
    
    // Determine file type from extension
    const fileName = req.file.originalname.toLowerCase();
    if (fileName.endsWith('.pdf')) {
      noteData.file_type = 'pdf';
    } else if (fileName.endsWith('.doc')) {
      noteData.file_type = 'doc';
    } else if (fileName.endsWith('.docx')) {
      noteData.file_type = 'docx';
    } else if (fileName.endsWith('.txt')) {
      noteData.file_type = 'txt';
    } else if (fileName.endsWith('.ppt') || fileName.endsWith('.pptx')) {
      noteData.file_type = 'ppt';
    }
  }

  // Create new note document in database
  const note = await Note.create(noteData);

  // Send notification to all students about new note
  await Notification.create({
    title: 'New Note',                        // Notification title
    message: `${title} is now available`,    // Notification message
    type: 'note',                            // Notification type
    to_role: 'student',                      // Broadcast to all students
    created_by: req.user.id                  // Admin who created the note
  });

  // Return created note with 201 Created status
  res.status(201).json({
    message: noteData.is_descriptive_only 
      ? 'Descriptive note created successfully' 
      : 'Note uploaded successfully',
    note
  });
});

// Add this function for downloading notes
export const downloadNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  
  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }
  
  // Check if note has a file to download
  if (!note.file_path || note.is_descriptive_only) {
    return res.status(400).json({ message: 'This note has no file to download' });
  }
  
  const filePath = path.join(process.cwd(), note.file_path);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found on server' });
  }
  
  res.download(filePath, note.file_name || 'note.pdf');
});

// Controller function to list notes with filtering and pagination
// Public/Optional auth endpoint - students can browse approved notes
export const listNotes = asyncHandler(async (req, res) => {
  // Check feature access
  const hasAccess = await checkFeatureAccess('notes', req.user);
  if (!hasAccess) {
    return res.status(403).json({
      message: 'This is a premium feature. Please upgrade to access notes.',
      code: 'PREMIUM_REQUIRED'
    });
  }

  // Extract pagination parameters
  const { page, limit, offset } = getPagination(req.query);

  // Build filter object for database query
  const where = {};

  // Add subject filter if provided
  if (req.query.subject_id) where.subject_id = req.query.subject_id;

  // Add class filter if provided
  if (req.query.class_id) where.class_id = req.query.class_id;

  // Add chapter filter if provided
  if (req.query.chapter_id) where.chapter_id = req.query.chapter_id;

  // Get user role for access control
  const userRole = req.user?.role;

  // Filter by approval status based on user role
  // Public, Student, Parent: Only approved notes visible
  if (!userRole || userRole === 'student' || userRole === 'parent') {
    where.approved = true;
  }
  // Admin/Teacher: Can filter by approval status
  else if (req.query.approved !== undefined) {
    where.approved = req.query.approved === 'true';
  }

  // Count total notes matching filter (for pagination metadata)
  const total = await Note.countDocuments(where);

  // Query notes with filter, population, sorting, and pagination
  const notes = await Note.find(where)
    .populate('subject_id')               // Populate subject details
    .populate('class_id')                 // Populate class details
    .populate('chapter_id')               // Populate chapter details
    .populate('uploaded_by', 'id name')   // Populate uploader name/ID
    .sort({ _id: -1 })                    // Sort by newest first
    .skip(offset)                         // Skip records for pagination
    .limit(limit);                        // Limit results per page

  // Return paginated response with metadata
  res.json({ total, page, limit, data: notes });
});

// Controller function to get a single note by ID
// Public/Optional auth endpoint with visibility based on approval
export const getNote = asyncHandler(async (req, res) => {
  // Check feature access
  const hasAccess = await checkFeatureAccess('notes', req.user);
  if (!hasAccess) {
    return res.status(403).json({
      message: 'This is a premium feature. Please upgrade to access notes.',
      code: 'PREMIUM_REQUIRED'
    });
  }

  // Find note by ID and populate related data
  const note = await Note.findById(req.params.id)
    .populate('subject_id')               // Populate subject details
    .populate('class_id')                 // Populate class details
    .populate('chapter_id')               // Populate chapter details
    .populate('uploaded_by', 'id name');  // Populate uploader name/ID

  // Return 404 if note not found
  if (!note) return res.status(404).json({ message: 'Not found' });

  // Get user role for access control
  const userRole = req.user?.role;

  // Check if user has permission to view unapproved note
  // Public users, students, and parents can only view approved notes
  if (!note.approved && (!userRole || userRole === 'student' || userRole === 'parent')) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Return note data
  res.json(note);
});

// Controller function to delete a note
// Protected endpoint - owner or admin can delete
export const deleteNote = asyncHandler(async (req, res) => {
  // Find note by ID from URL parameters
  const note = await Note.findById(req.params.id);

  // Return 404 if note not found
  if (!note) return res.status(404).json({ message: 'Not found' });

  // Check if current user is the note owner
  // Note: uploaded_by is an ObjectId, so convert to string for comparison
  const isOwner = note.uploaded_by.toString() === req.user.id;

  // Check if current user is admin
  const isAdmin = req.user.role === 'admin';

  // Only owner or admin can delete - return 403 otherwise
  if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Forbidden' });

  // Delete note document from database
  await note.deleteOne();

  // Attempt to delete associated note file (only if it exists and not descriptive)
  if (note.file_path && !note.is_descriptive_only) {
    try {
      // Remove leading slash from file path
      const relPath = note.file_path.replace(/^\//, '');

      // Construct full file path
      const fullPath = path.join(process.cwd(), relPath);

      // Delete file if it exists on file system
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    } catch {
      // Silently catch file deletion errors
      // File might already be deleted or path might be invalid
    }
  }

  // Return success message confirming deletion
  res.json({ message: 'Deleted' });
});

// Controller function to approve or unapprove a note
// Admin-only endpoint for controlling note visibility
export const approveNote = asyncHandler(async (req, res) => {
  // Find note by ID from URL parameters
  const note = await Note.findById(req.params.id);

  // Return 404 if note not found
  if (!note) return res.status(404).json({ message: 'Not found' });

  // Update approval status from request body
  // Convert string 'true' to boolean true
  note.approved = req.body.approved === true || req.body.approved === 'true';

  // Save updated note to database
  await note.save();

  // If note was approved, send notification to students
  if (note.approved) {
    await Notification.create({
      title: 'New Note',                     // Notification title
      message: `${note.title} is available`, // Notification message
      type: 'note',                          // Notification type
      to_role: 'student',                    // Broadcast to all students
      created_by: req.user.id                // Admin who approved the note
    });
  }

  // Return updated note data
  res.json(note);
});

// Controller function to get notes uploaded by current admin
// Admin-only endpoint for viewing own uploaded notes
export const getMyNotes = asyncHandler(async (req, res) => {
  // Extract pagination parameters
  const { page, limit, offset } = getPagination(req.query);

  // Build filter object - only notes uploaded by current user
  const where = { uploaded_by: req.user.id };

  // Optional filters can be applied
  // Add subject filter if provided
  if (req.query.subject_id) where.subject_id = req.query.subject_id;

  // Add class filter if provided
  if (req.query.class_id) where.class_id = req.query.class_id;

  // Add approval status filter if provided
  if (req.query.approved !== undefined) {
    where.approved = req.query.approved === 'true';
  }

  // Count total notes matching filter (for pagination metadata)
  const total = await Note.countDocuments(where);

  // Query notes with filter, population, sorting, and pagination
  const notes = await Note.find(where)
    .populate('subject_id')        // Populate subject details
    .populate('class_id')          // Populate class details
    .populate('chapter_id')        // Populate chapter details
    .sort({ createdAt: -1 })       // Sort by newest first
    .skip(offset)                  // Skip records for pagination
    .limit(limit);                 // Limit results per page

  // Return paginated response with metadata
  res.json({ total, page, limit, data: notes });
});