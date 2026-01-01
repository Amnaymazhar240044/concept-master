// Import async handler wrapper for error handling in async route handlers
import { asyncHandler } from '../utils/asyncHandler.js';

// Import Class model from centralized models export
import { Class } from '../models/index.js';

// Controller function to create a new class
// Admin-only endpoint for adding new grade levels to the system
export const createClass = asyncHandler(async (req, res) => {
  // Create new class document using title from request body
  // Example: { title: "Class 11" }
  const c = await Class.create({ title: req.body.title });

  // Return created class with 201 Created status
  res.status(201).json(c);
});

// Controller function to list all classes
// Public endpoint - used during registration and content filtering
export const listClasses = asyncHandler(async (req, res) => {
  // Query all classes from database
  // Sort alphabetically by title for consistent ordering
  const list = await Class.find().sort({ title: 1 });

  // Return classes array as JSON response
  res.json(list);
});

// Controller function to update an existing class
// Admin-only endpoint for modifying class titles
export const updateClass = asyncHandler(async (req, res) => {
  // Find class by ID from URL parameters
  const c = await Class.findById(req.params.id);

  // Return 404 if class doesn't exist
  if (!c) return res.status(404).json({ message: 'Not found' });

  // Update title using nullish coalescing to preserve existing value if not provided
  // This allows partial updates
  c.title = req.body.title ?? c.title;

  // Save updated class to database
  await c.save();

  // Return updated class data
  res.json(c);
});

// Controller function to delete a class
// Admin-only endpoint for removing grade levels from the system
export const deleteClass = asyncHandler(async (req, res) => {
  // Find class by ID from URL parameters
  const c = await Class.findById(req.params.id);

  // Return 404 if class doesn't exist
  if (!c) return res.status(404).json({ message: 'Not found' });

  // Delete the class document from database
  await c.deleteOne();

  // Return success message confirming deletion
  res.json({ message: 'Deleted' });
});

// Controller function to get a single class by ID
// Public endpoint for fetching specific class details
export const getClass = asyncHandler(async (req, res) => {
  // Find class by ID from URL parameters
  const c = await Class.findById(req.params.id);

  // Return 404 if class doesn't exist
  if (!c) return res.status(404).json({ message: 'Not found' });

  // Return class data
  res.json(c);
});
