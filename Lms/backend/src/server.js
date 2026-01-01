// Import Express framework for building the web server
import express from 'express';

// Import dotenv for loading environment variables from .env file
import dotenv from 'dotenv';

// Import CORS middleware for handling Cross-Origin Resource Sharing
import cors from 'cors';

// Import Helmet for setting security-related HTTP headers
import helmet from 'helmet';

// Import compression middleware for gzip compression of HTTP responses
import compression from 'compression';

// Import Morgan for HTTP request logging
import morgan from 'morgan';

// Import express-rate-limit for implementing rate limiting to prevent abuse
import rateLimit from 'express-rate-limit';

// Import path module for working with file and directory paths
import path from 'path';

// Import file URL conversion utility for ES modules
import { fileURLToPath } from 'url';

// Import database connection function
import { connectDB } from './config/db.js';

// Import all route modules for API endpoints
import authRoutes from './routes/auth.routes.js';
import notesRoutes from './routes/notes.routes.js';
import lecturesRoutes from './routes/lectures.routes.js';
import quizzesRoutes from './routes/quizzes.routes.js';
import resultsRoutes from './routes/results.routes.js';
import notificationsRoutes from './routes/notifications.routes.js';
import adminRoutes from './routes/admin.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import subjectsRoutes from './routes/subjects.routes.js';
import classesRoutes from './routes/classes.routes.js';
import aiRoutes from './routes/ai.routes.js';
import booksRoutes from './routes/books.routes.js';
import chaptersRoutes from './routes/chapters.routes.js';
import featureControlRoutes from './routes/featureControl.routes.js';
import reviewsRoutes from './routes/reviews.routes.js';

// Import error handling middlewares
import { errorHandler, notFound } from './middlewares/error.js';

// Load environment variables from .env file into process.env
dotenv.config();

// Create Express application instance
const app = express();

// Get current file path (needed for ES modules which don't have __filename by default)
const __filename = fileURLToPath(import.meta.url);

// Get directory name from file path (equivalent to __dirname in CommonJS)
const __dirname = path.dirname(__filename);

// Connect to MongoDB database and seed initial data
connectDB().then(async () => {
    // After successful database connection, run seeding scripts
    // These populate the database with essential initial data

    // Dynamically import seedAdmin function to create default admin user
    const { seedAdmin } = await import('./utils/seedAdmin.js');

    // Dynamically import seedClasses function to create class records (9-12)
    const { seedClasses } = await import('./utils/seedClasses.js');

    // Execute admin user seeding (creates admin@lms.com if doesn't exist)
    await seedAdmin();

    // Execute class seeding (creates Class 9, 10, 11, 12 if they don't exist)
    // Execute class seeding (creates Class 9, 10, 11, 12 if they don't exist)
    await seedClasses();

    const { initializeFeatures } = await import('./controllers/featureControl.controller.js');
    await initializeFeatures();
});

// Trust the proxy server (important for deployment behind reverse proxies like Nginx)
// This allows Express to correctly process headers forwarded by the proxy
app.set('trust proxy', 1);

// Configure Helmet security middleware with custom options
// crossOriginResourcePolicy set to "cross-origin" allows loading resources from different origins
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// Configure CORS to allow requests from specified origins
// Reads allowed origins from environment variable (comma-separated) or allows all origins
// credentials:true allows cookies and authentication headers in cross-origin requests
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: true }));

// Enable gzip compression for all HTTP responses to reduce bandwidth usage
app.use(compression());

// Parse incoming JSON payloads with a 5MB size limit
// This middleware makes JSON data available in req.body
app.use(express.json({ limit: '5mb' }));

// Parse URL-encoded form data (extended:true allows nested objects)
app.use(express.urlencoded({ extended: true }));

// Enable HTTP request logging using Morgan with 'combined' format
// Logs detailed request information to console for debugging and monitoring
app.use(morgan('combined'));

// Configure rate limiter to prevent API abuse and DDoS attacks
// Allows maximum 1000 requests per IP address within 15-minute window
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
    max: 1000 // Maximum 1000 requests per window per IP
});

// Apply rate limiting to all routes
app.use(limiter);

// Define path to uploads directory for serving uploaded files
const uploadsDir = path.join(__dirname, '..', 'uploads');

// Define path to public directory for serving static assets
const publicDir = path.join(__dirname, '..', 'public');

// Serve static files from uploads directory at /uploads route
// This allows accessing uploaded notes, videos, and images via HTTP
app.use('/uploads', express.static(uploadsDir));

// Serve static files from public directory at /public route
app.use('/public', express.static(publicDir));

// Health check endpoint for monitoring server status
// Returns simple JSON response to confirm server is running
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Mount all route modules to their respective base paths
// All API endpoints are prefixed with /api

// Authentication routes: login, register, profile management
app.use('/api/auth', authRoutes);

// Notes routes: upload, list, approve study material PDFs
app.use('/api/notes', notesRoutes);

// Lecture routes: upload, list, approve video lectures
app.use('/api/lectures', lecturesRoutes);

// Quiz routes: create, list, attempt, grade quizzes
app.use('/api/quizzes', quizzesRoutes);

// Results routes: view quiz attempts and detailed results
app.use('/api/results', resultsRoutes);

// Notification routes: create, list, mark as read announcements
app.use('/api/notifications', notificationsRoutes);

// Admin routes: user management, analytics, system administration
app.use('/api/admin', adminRoutes);

// Analytics routes: student performance and system statistics
app.use('/api/analytics', analyticsRoutes);

// Subject routes: manage academic subjects
app.use('/api/subjects', subjectsRoutes);

// Class routes: manage grade levels (9-12)
app.use('/api/classes', classesRoutes);

// Chapter routes: manage book chapters
app.use('/api/chapters', chaptersRoutes);

// AI routes: Gemini AI chat for Concept Master feature
app.use('/api/ai', aiRoutes);

// Books routes: manage educational book catalog with e-commerce features
// Books routes: manage educational book catalog with e-commerce features
app.use('/api/books', booksRoutes);

// Feature Control routes
app.use('/api/feature-control', featureControlRoutes);

// Reviews routes
app.use('/api/reviews', reviewsRoutes);

// 404 handler - catches all requests to undefined routes
// Must be placed after all other routes
app.use(notFound);

// Global error handler - catches all errors from async route handlers
// Must be the last middleware in the chain
app.use(errorHandler);

// Get port number from environment variable or default to 5000
const port = process.env.PORT || 5000;

// Start the Express server and listen on specified port
// Log confirmation message when server successfully starts
app.listen(port, () => console.log(`API running on :${port}`));
