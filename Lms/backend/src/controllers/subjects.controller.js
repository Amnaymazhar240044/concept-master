// Import async handler wrapper for error handling in async route handlers
import { asyncHandler } from '../utils/asyncHandler.js';

// Import Subject model from centralized models export
import { Subject } from '../models/index.js';

// Controller function to create a new subject
// Admin-only endpoint for adding new academic subjects to the system
export const createSubject = asyncHandler(async (req, res) => {
  // Create new subject document using name from request body
  // Example: { name: "Mathematics" }
  // Mongoose will enforce unique constraint on subject name
  const s = await Subject.create({ name: req.body.name });

  // Return created subject with 201 Created status
  res.status(201).json(s);
});

// Controller function to list all subjects
// Public/Optional auth endpoint - used for content browsing and filtering
export const listSubjects = asyncHandler(async (req, res) => {
  // Query all subjects from database
  // Sort alphabetically by name for consistent ordering
  const list = await Subject.find().sort({ name: 1 });

  // Return subjects array as JSON response
  res.json(list);
});

// Controller function to update an existing subject
// Admin-only endpoint for modifying subject names
export const updateSubject = asyncHandler(async (req, res) => {
  // Find subject by ID from URL parameters
  const s = await Subject.findById(req.params.id);

  // Return 404 if subject doesn't exist
  if (!s) return res.status(404).json({ message: 'Not found' });

  // Update name using nullish coalescing to preserve existing value if not provided
  // This allows partial updates
  s.name = req.body.name ?? s.name;

  // Save updated subject to database
  await s.save();

  // Return updated subject data
  res.json(s);
});

// Controller function to delete a subject
// Admin-only endpoint for removing subjects from the system
export const deleteSubject = asyncHandler(async (req, res) => {
  // Find subject by ID from URL parameters
  const s = await Subject.findById(req.params.id);

  // Return 404 if subject doesn't exist
  if (!s) return res.status(404).json({ message: 'Not found' });

  // Delete the subject document from database
  // Warning: This may affect associated chapters and content
  await s.deleteOne();

  // Return success message confirming deletion
  res.json({ message: 'Deleted' });
});
