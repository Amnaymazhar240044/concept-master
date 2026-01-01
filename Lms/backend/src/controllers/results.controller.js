// Import async handler wrapper for error handling
import { asyncHandler } from '../utils/asyncHandler.js';

// Import pagination utility
import { getPagination } from '../utils/pagination.js';

// Import models for quiz results and attempts
import { QuizAttempt, QuizResult, Question, Quiz, User } from '../models/index.js';

// Controller function to get a specific quiz attempt
// Protected endpoint - students can only view their own attempts
export const getAttempt = asyncHandler(async (req, res) => {
  // Find quiz attempt by ID and populate related data
  const attempt = await QuizAttempt.findById(req.params.id)
    .populate('quiz_id')                    // Populate quiz details
    .populate('student_id', 'id name email'); // Populate student info

  // Return 404 if attempt not found
  if (!attempt) return res.status(404).json({ message: 'Not found' });

  // Authorization check - students can only view their own attempts
  // Admins can view any attempt
  if (req.user.role === 'student' && attempt.student_id._id.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Return attempt data (basic info without question-by-question breakdown)
  res.json(attempt);
});

// Controller function to get detailed quiz attempt results
// Protected endpoint with question-by-question breakdown and AI feedback
export const getAttemptDetails = asyncHandler(async (req, res) => {
  // Extract attempt ID from URL parameters
  const attemptId = req.params.id;

  // Find quiz attempt by ID and populate related data
  const attempt = await QuizAttempt.findById(attemptId)
    .populate('quiz_id')                    // Populate quiz details
    .populate('student_id', 'id name email'); // Populate student info

  // Return 404 if attempt not found
  if (!attempt) return res.status(404).json({ message: 'Not found' });

  // Authorization check - students can only view their own attempts
  // Admins can view any attempt
  if (req.user.role === 'student' && attempt.student_id._id.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Fetch detailed results for each question in this attempt
  // This includes correctness, selected answers, and AI feedback
  const results = await QuizResult.find({ attempt_id: attemptId })
    .populate('question_id');  // Populate full question details

  // Return comprehensive attempt data with question-by-question results
  res.json({
    attempt,        // Basic attempt info (score, percentage, timestamps)
    quiz_results: results  // Detailed results for each question
  });
});

// Controller function to list quiz attempts for a specific student
// Used by students to view their own attempts, or by admins/teachers to view a student's attempts
export const listStudentAttempts = asyncHandler(async (req, res) => {
  // Extract pagination parameters
  const { page, limit, offset } = getPagination(req.query);

  // Determine student ID based on user role
  // Students can only access their own attempts
  // Admins/teachers can access any student's attempts via URL parameter
  const studentId = req.user.role === 'student' ? req.user.id : req.params.studentId;

  // Count total attempts for this student
  const total = await QuizAttempt.countDocuments({ student_id: studentId });

  // Query attempts with pagination
  const attempts = await QuizAttempt.find({ student_id: studentId })
    .populate('quiz_id')     // Populate quiz title and details
    .sort({ _id: -1 })       // Sort by newest first
    .skip(offset)            // Skip records for pagination
    .limit(limit);           // Limit results per page

  // Return paginated response with metadata
  res.json({ total, page, limit, data: attempts });
});

// Controller function to get all quiz attempts across all students
// Admin-only endpoint for system-wide attempt monitoring with search
export const getAllAttempts = asyncHandler(async (req, res) => {
  // Extract pagination parameters and search query
  const { page, limit, offset } = getPagination(req.query);
  const { search } = req.query;

  // Initialize filter object
  let where = {};

  // If search query provided, search across student names and quiz titles
  if (search) {
    // Find users matching search term (case-insensitive)
    const users = await User.find({ name: { $regex: search, $options: 'i' } }).select('_id');
    const userIds = users.map(u => u._id);

    // Find quizzes matching search term (case-insensitive)
    const quizzes = await Quiz.find({ title: { $regex: search, $options: 'i' } }).select('_id');
    const quizIds = quizzes.map(q => q._id);

    // Build OR query to match either student or quiz
    where = {
      $or: [
        { student_id: { $in: userIds } },   // Attempts by matching students
        { quiz_id: { $in: quizIds } }       // Attempts for matching quizzes
      ]
    };
  }

  // Count total attempts matching filter
  const total = await QuizAttempt.countDocuments(where);

  // Query attempts with filter, population, sorting, and pagination
  const attempts = await QuizAttempt.find(where)
    .populate('student_id', 'name email')  // Populate student name and email
    .populate('quiz_id', 'title')          // Populate quiz title
    .sort({ createdAt: -1 })               // Sort by most recent first
    .skip(offset)                          // Skip records for pagination
    .limit(limit);                         // Limit results per page

  // Return paginated response with metadata
  res.json({ total, page, limit, data: attempts });
});
