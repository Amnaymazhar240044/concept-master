// Import Router from Express for creating modular route handlers
import { Router } from 'express';

// Import authentication and authorization middlewares for access control
import { authenticate, authorize, requirePremium } from '../middlewares/auth.js';

// Import quiz controller functions for handling quiz-related requests
import { addQuestion, createQuiz, deleteQuiz, getQuiz, listQuestions, listQuizzes, myAttempts, quizAttempts, submitAttempt, updateQuiz, getMyAttempt } from '../controllers/quizzes.controller.js';

// Create a new Express router instance for quiz routes
const router = Router();

// GET /quizzes - Protected endpoint to list all published quizzes
// Requires: valid JWT token
// Returns: array of available quizzes for the user's class/subject
router.get('/', authenticate, listQuizzes);

// GET /quizzes/me/attempts/list - Protected endpoint for students to view their quiz attempts
// Requires: valid JWT token and student role
// Returns: list of all quiz attempts made by the current student
router.get('/me/attempts/list', authenticate, authorize(['student']), myAttempts);

// GET /quizzes/:id - Protected endpoint to get specific quiz details
// Requires: valid JWT token
// Returns: quiz data including title, duration, type, and questions
router.get('/:id', authenticate, getQuiz);

// POST /quizzes - Admin-only endpoint to create a new quiz
// Teacher role has been removed, only admin can create quizzes now
// Requires: valid JWT token and admin role
// Accepts: quiz details (title, description, duration, type, etc.)
router.post('/', authenticate, authorize(['admin']), createQuiz);

// PATCH /quizzes/:id - Admin-only endpoint to update existing quiz
// Requires: valid JWT token and admin role
// Accepts: partial quiz data to update
router.patch('/:id', authenticate, authorize(['admin']), updateQuiz);

// DELETE /quizzes/:id - Admin-only endpoint to delete a quiz
// Requires: valid JWT token and admin role
router.delete('/:id', authenticate, authorize(['admin']), deleteQuiz);

// GET /quizzes/:quizId/questions - Admin-only endpoint to list all questions in a quiz
// Requires: valid JWT token and admin role
// Returns: array of questions for the specified quiz
router.get('/:quizId/questions', authenticate, authorize(['admin']), listQuestions);

// POST /quizzes/:quizId/questions - Admin-only endpoint to add a question to a quiz
// Requires: valid JWT token and admin role
// Accepts: question data (text, options, correct answer, etc.)
router.post('/:quizId/questions', authenticate, authorize(['admin']), addQuestion);

// POST /quizzes/:quizId/attempts - Student-only premium endpoint to submit quiz answers
// Requires: valid JWT token, student role, and premium subscription
// Accepts: array of answers for each question
// Returns: graded results with score and AI feedback for short answers
router.post('/:quizId/attempts', authenticate, authorize(['student']), submitAttempt);

// GET /quizzes/:quizId/attempts - Admin-only endpoint to view all attempts for a quiz
// Requires: valid JWT token and admin role
// Returns: array of all student attempts for the quiz
router.get('/:quizId/attempts', authenticate, authorize(['admin']), quizAttempts);

// GET /quizzes/:quizId/my-attempt - Student endpoint to get their own quiz attempt
// Requires: valid JWT token and student role
// Returns: student's attempt data including score and answers
router.get('/:quizId/my-attempt', authenticate, authorize(['student']), getMyAttempt);

// Export router to be mounted in main application
export default router;
