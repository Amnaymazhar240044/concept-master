// Import async handler wrapper for error handling in async route handlers
import { asyncHandler } from '../utils/asyncHandler.js';

// Import Chapter model for database operations
import { Chapter } from '../models/Chapter.js';

// Controller function to create a new chapter
// Admin-only endpoint for adding chapters to subjects within classes
export const createChapter = asyncHandler(async (req, res) => {
    // Destructure chapter data from request body
    const { title, subject_id, class_id, order } = req.body;

    // Create new chapter document in database
    // Mongoose will validate required fields and unique compound index
    const chapter = await Chapter.create({
        title,           // Chapter name (e.g., "Chapter 1: Introduction")
        subject_id,      // Reference to Subject this chapter belongs to
        class_id,        // Reference to Class this chapter is for
        order            // Numeric order for sorting chapters
    });

    // Return created chapter with 201 Created status
    res.status(201).json(chapter);
});

// Controller function to list chapters with optional filtering
// Used by students and admins to browse chapters by subject/class
export const listChapters = asyncHandler(async (req, res) => {
    // Extract filter parameters from query string
    const { subject_id, class_id } = req.query;

    // Build MongoDB filter object dynamically
    const filter = {};

    // Add subject_id to filter if provided in query
    if (subject_id) filter.subject_id = subject_id;

    // Add class_id to filter if provided in query
    if (class_id) filter.class_id = class_id;

    // Query database with constructed filter
    // Sort first by order field (ascending), then by creation date
    // This ensures chapters display in intended sequence
    const chapters = await Chapter.find(filter).sort({ order: 1, createdAt: 1 });

    // Return chapters array as JSON response
    res.json(chapters);
});

// Controller function to update an existing chapter
// Admin-only endpoint for modifying chapter details
export const updateChapter = asyncHandler(async (req, res) => {
    // Extract chapter ID from URL parameters
    const { id } = req.params;

    // Extract updated fields from request body
    const { title, order } = req.body;

    // Find chapter by ID and update with new values
    // new:true returns the updated document instead of original
    // runValidators:true ensures validation rules are applied to update
    const chapter = await Chapter.findByIdAndUpdate(
        id,                          // Chapter ID to update
        { title, order },            // Fields to update
        { new: true, runValidators: true }  // Options
    );

    // Check if chapter was found
    if (!chapter) {
        // Return 404 if chapter doesn't exist
        return res.status(404).json({ message: 'Chapter not found' });
    }

    // Return updated chapter data
    res.json(chapter);
});

// Controller function to delete a chapter
// Admin-only endpoint for removing chapters from the system
export const deleteChapter = asyncHandler(async (req, res) => {
    // Extract chapter ID from URL parameters
    const { id } = req.params;

    // Find and delete chapter in single operation
    const chapter = await Chapter.findByIdAndDelete(id);

    // Check if chapter was found and deleted
    if (!chapter) {
        // Return 404 if chapter doesn't exist
        return res.status(404).json({ message: 'Chapter not found' });
    }

    // Return success message confirming deletion
    res.json({ message: 'Chapter deleted successfully' });
});
