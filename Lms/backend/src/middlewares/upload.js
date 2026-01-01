// Import multer library for handling multipart/form-data file uploads
import multer from 'multer';

// Import path module for working with file and directory paths
import path from 'path';

// Import fs module for file system operations like creating directories
import fs from 'fs';

// Configure disk storage for uploaded files
// This determines where files are saved and how they're named
const storage = multer.diskStorage({
  // Function to determine destination directory for uploaded files
  destination: function (req, file, cb) {
    // Default directory for files that don't match specific field names
    let dir = 'uploads/others';

    // If file is from 'note' field, save to notes directory
    if (file.fieldname === 'note') dir = 'uploads/notes';

    // If file is from 'video' field, save to videos directory
    if (file.fieldname === 'video') dir = 'uploads/videos';

    // Create directory if it doesn't exist, recursive:true creates parent directories
    fs.mkdirSync(dir, { recursive: true });

    // Callback with null error and determined directory path
    cb(null, dir);
  },

  // Function to generate unique filename for uploaded files
  filename: function (req, file, cb) {
    // Extract file extension from original filename (e.g., '.pdf', '.mp4')
    const ext = path.extname(file.originalname);

    // Get filename without extension and sanitize it
    // Remove special characters, keeping only alphanumeric, underscore, and hyphen
    // This prevents path traversal attacks and filesystem issues
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '');

    // Construct unique filename: sanitized-base-timestamp.extension
    // Timestamp prevents filename collisions when uploading files with same name
    cb(null, `${base}-${Date.now()}${ext}`);
  }
});

// Export configured multer middleware instance for use in routes
// This can be used directly in route handlers to process file uploads
export const upload = multer({ storage });
