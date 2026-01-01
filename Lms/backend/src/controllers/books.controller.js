// Import Book model for database operations
import Book from '../models/Book.js';

// Import async handler wrapper for error handling in async route handlers  
import { asyncHandler } from '../utils/asyncHandler.js';

// Import path module for file path operations
import path from 'path';

// Import fs module for file system operations (deleting old images)
import fs from 'fs';

// Create a new book (Admin only)
// Handles book creation with optional cover image upload
export const createBook = asyncHandler(async (req, res) => {
    // Destructure book data from request body
    const { title, author, price, category, grade, description, features, discount } = req.body;

    // Handle cover image upload if file was provided
    let coverImage = null;
    if (req.file) {
        // Store relative path to uploaded image
        // Multer has already saved the file to uploads/books directory
        coverImage = `/uploads/books/${req.file.filename}`;
    }

    // Parse features field - can be JSON string or comma-separated string
    let parsedFeatures = features;
    if (typeof features === 'string') {
        try {
            // Try to parse as JSON array first
            parsedFeatures = JSON.parse(features);
        } catch (e) {
            // If JSON parsing fails, split comma-separated string
            // Trim whitespace from each feature
            parsedFeatures = features.split(',').map(f => f.trim());
        }
    }

    // Create new book document in database
    const book = await Book.create({
        title,                           // Book title
        author,                          // Author name
        price: Number(price),            // Convert price to number
        coverImage,                      // Path to cover image
        category,                        // Book category (e.g., "General")
        grade,                           // Target grade level (9th, 10th, etc.)
        description,                     // Detailed book description
        features: parsedFeatures || [],  // Array of book features
        discount: discount ? Number(discount) : 0  // Discount percentage (0 if not provided)
    });

    // Return success response with created book data
    res.status(201).json({
        message: 'Book created successfully',
        book
    });
});

// Get all books with optional filters
// Public endpoint for browsing book catalog
export const listBooks = asyncHandler(async (req, res) => {
    // Extract filter parameters from query string
    const { grade, category, search } = req.query;

    // Initialize filter object - only show in-stock books by default
    let filter = { inStock: true };

    // Add grade filter if provided
    if (grade) {
        filter.grade = grade;
    }

    // Add category filter if provided
    if (category) {
        filter.category = category;
    }

    // Add full-text search if search term provided
    // Uses text index on title and author fields
    if (search) {
        filter.$text = { $search: search };
    }

    // Query books with constructed filter
    // Sort by newest first (createdAt descending)
    const books = await Book.find(filter).sort({ createdAt: -1 });

    // Return books array with count
    res.json({
        count: books.length,
        books
    });
});

// Get single book by ID
// Public endpoint for viewing book details
export const getBook = asyncHandler(async (req, res) => {
    // Find book by ID from URL parameters
    const book = await Book.findById(req.params.id);

    // Return 404 if book not found
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    // Return book data
    res.json(book);
});

// Update book (Admin only)
// Handles book updates with optional new cover image
export const updateBook = asyncHandler(async (req, res) => {
    // Destructure updated book data from request body
    const { title, author, price, category, grade, description, features, discount, inStock } = req.body;

    // Find existing book by ID
    const book = await Book.findById(req.params.id);

    // Return 404 if book not found
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    // Handle new cover image upload
    if (req.file) {
        // Delete old image file if it exists
        if (book.coverImage) {
            // Construct full path to old image file
            // Remove leading slash and join with project root
            const oldImagePath = path.join(process.cwd(), book.coverImage.replace(/^\//, ''));

            // Check if old image file exists before attempting deletion
            if (fs.existsSync(oldImagePath)) {
                // Delete old image file from file system
                fs.unlinkSync(oldImagePath);
            }
        }

        // Update cover image path to new uploaded file
        book.coverImage = `/uploads/books/${req.file.filename}`;
    }

    // Parse features field if provided
    let parsedFeatures = features;
    if (typeof features === 'string') {
        try {
            // Try to parse as JSON array first
            parsedFeatures = JSON.parse(features);
        } catch (e) {
            // If JSON parsing fails, split comma-separated string
            parsedFeatures = features.split(',').map(f => f.trim());
        }
    }

    // Update book fields only if provided in request
    // This allows partial updates
    if (title) book.title = title;
    if (author) book.author = author;
    if (price) book.price = Number(price);
    if (category) book.category = category;
    if (grade) book.grade = grade;
    if (description !== undefined) book.description = description;
    if (parsedFeatures) book.features = parsedFeatures;
    if (discount !== undefined) book.discount = Number(discount);
    if (inStock !== undefined) book.inStock = inStock;

    // Save updated book to database
    await book.save();

    // Return success response with updated book data
    res.json({
        message: 'Book updated successfully',
        book
    });
});

// Delete book (Admin only)
// Removes book and associated cover image from system
export const deleteBook = asyncHandler(async (req, res) => {
    // Find book by ID from URL parameters
    const book = await Book.findById(req.params.id);

    // Return 404 if book not found
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    // Delete cover image file if it exists
    if (book.coverImage) {
        // Construct full path to image file
        const imagePath = path.join(process.cwd(), book.coverImage.replace(/^\//, ''));

        // Check if image file exists before attempting deletion
        if (fs.existsSync(imagePath)) {
            // Delete image file from file system
            fs.unlinkSync(imagePath);
        }
    }

    // Delete book document from database
    await Book.findByIdAndDelete(req.params.id);

    // Return success message confirming deletion
    res.json({ message: 'Book deleted successfully' });
});
