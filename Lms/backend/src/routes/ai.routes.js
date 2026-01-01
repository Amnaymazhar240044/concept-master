// Import Router from Express for creating modular route handlers
import { Router } from 'express';

// Import authentication and premium access control middlewares
import { authenticate, requirePremium } from '../middlewares/auth.js';

// Import AI controller function for Gemini AI integration
import { generateContent } from '../controllers/ai.controller.js';

// Create a new Express router instance for AI routes
const router = Router();

// Apply authentication middleware to all routes in this router
// All AI features require user to be logged in
router.use(authenticate);

// POST /ai/generate - Premium-only endpoint for AI chat and content generation 
// Requires: valid JWT token and premium subscription (or admin role)
// Accepts: conversation history and new message in request body
// Returns: AI-generated response using Google Gemini model
// Used for Concept Master AI chat feature
router.post('/generate', generateContent);

// Export router to be mounted in main application
export default router;
