// Import Router from Express for creating modular route handlers
import { Router } from 'express';

// Import authentication and authorization middlewares
import { authenticate, authorize } from '../middlewares/auth.js';

// Import book controller functions for managing educational books
import { createBook, listBooks, getBook, updateBook, deleteBook } from '../controllers/books.controller.js';

// Import multer for handling file uploads
import multer from 'multer';

// Import path module for file path operations
import path from 'path';

// Import fs module for file system operations
import fs from 'fs';

// Create a new Express router instance for book routes
const router = Router();

// Configure multer disk storage for book cover image uploads
const storage = multer.diskStorage({
    // Define destination directory for uploaded cover images
    destination: (req, file, cb) => {
        // Set upload directory path for book covers
        const uploadDir = 'uploads/books';

        // Create directory if it doesn't exist yet
        // recursive:true ensures parent directories are created if needed
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Callback with null error and determined directory path
        cb(null, uploadDir);
    },

    // Define filename generation logic for uploaded files
    filename: (req, file, cb) => {
        // Generate unique suffix using timestamp and random number
        // This prevents filename collisions when multiple admins upload simultaneously
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

        // Construct filename: 'book-' + unique suffix + original file extension
        // Example: 'book-1234567890-123456789.jpg'
        cb(null, 'book-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Configure multer upload middleware with storage, limits, and file filtering
const upload = multer({
    // Use the configured disk storage
    storage,

    // Set maximum file size to 5MB to prevent excessive uploads
    // 5 * 1024 * 1024 bytes = 5 megabytes
    limits: { fileSize: 5 * 1024 * 1024 },

    // Define file filter to accept only image files
    fileFilter: (req, file, cb) => {
        // Regular expression to match allowed image file extensions
        const allowedTypes = /jpeg|jpg|png|webp/;

        // Test file extension against allowed types (case-insensitive)
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

        // Test MIME type against allowed image types
        const mimetype = allowedTypes.test(file.mimetype);

        // If both extension and MIME type are valid image types
        if (extname && mimetype) {
            // Accept the file upload
            return cb(null, true);
        } else {
            // Reject the file with an error message
            cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed!'));
        }
    }
});

// Public routes - anyone can browse books without authentication

// GET /books - Public endpoint to list all books
// Supports filtering by grade, category via query parameters
// Returns: array of books with pricing, ratings, and availability info
router.get('/', listBooks);

// GET /books/:id - Public endpoint to get a specific book
// Returns: single book object with full details including features and description
router.get('/:id', getBook);

// Admin routes - require authentication and admin role for book management

// POST /books - Admin-only endpoint to create a new book
// Requires: valid JWT token and admin role
// Accepts: multipart form data with optional coverImage file and book metadata
// upload.single('coverImage') processes the cover image upload
router.post('/', authenticate, authorize(['admin']), upload.single('coverImage'), createBook);

// PUT /books/:id - Admin-only endpoint to update an existing book
// Requires: valid JWT token and admin role
// Accepts: multipart form data with optional new coverImage and updated book data
router.put('/:id', authenticate, authorize(['admin']), upload.single('coverImage'), updateBook);

// DELETE /books/:id - Admin-only endpoint to delete a book
// Requires: valid JWT token and admin role
// Removes book and associated cover image from system
router.delete('/:id', authenticate, authorize(['admin']), deleteBook);

// Export router to be mounted in main application
export default router;
