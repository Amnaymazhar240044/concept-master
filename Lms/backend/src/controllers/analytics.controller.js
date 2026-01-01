// Import async handler wrapper for error handling
import { asyncHandler } from '../utils/asyncHandler.js';

// Import models for analytics queries
import { QuizAttempt, QuizResult, Question, User, Note, Lecture, Quiz } from '../models/index.js';

// Controller function for student performance overview
// Student-only endpoint showing personal quiz attempt history
export const studentOverview = asyncHandler(async (req, res) => {
  // Get current student's ID from JWT token
  const studentId = req.user.id;

  // Query all quiz attempts for this student
  const attempts = await QuizAttempt.find({ student_id: studentId })
    .populate('quiz_id', 'title')  // Populate quiz title only
    .sort({ _id: -1 })             // Sort by newest first
    .limit(50)                     // Limit to 50 most recent attempts
    .lean();                       // Return plain JavaScript objects (faster)

  // Format attempts for frontend consumption
  const formattedAttempts = attempts.map(a => ({
    title: a.quiz_id?.title || 'Unknown Quiz',  // Quiz title or fallback
    score: a.score,                              // Number of correct answers
    percentage: a.percentage,                    // Percentage score
    attempted_at: a.createdAt                    // Timestamp of attempt
  }));

  // Return formatted attempts array
  res.json({ attempts: formattedAttempts });
});

// Controller function for SLO (Student Learning Outcome) accuracy analysis
// Student-only endpoint showing performance breakdown by learning outcomes
export const sloAccuracy = asyncHandler(async (req, res) => {
  // Get current student's ID from JWT token
  const studentId = req.user.id;

  // Get all quiz attempts for this student
  const attempts = await QuizAttempt.find({ student_id: studentId }).select('_id');

  // Extract attempt IDs for aggregation pipeline
  const attemptIds = attempts.map(a => a._id);

  // Aggregate quiz results by SLO tag using MongoDB aggregation pipeline
  const results = await QuizResult.aggregate([
    // Match only results from this student's attempts
    { $match: { attempt_id: { $in: attemptIds } } },

    // Join with questions collection to get SLO tags
    {
      $lookup: {
        from: 'questions',              // Collection to join
        localField: 'question_id',      // Field from QuizResult
        foreignField: '_id',            // Field from questions
        as: 'question'                  // Output array field name
      }
    },

    // Unwind the question array (convert array to object)
    { $unwind: '$question' },

    // Filter out questions without SLO tags
    { $match: { 'question.slo_tag': { $ne: null, $exists: true } } },

    // Group by SLO tag and calculate accuracy percentage
    {
      $group: {
        _id: '$question.slo_tag',       // Group by SLO tag
        // Calculate accuracy: 100 if correct, 0 if incorrect, then average
        accuracy: { $avg: { $cond: ['$correct', 100, 0] } }
      }
    },

    // Project final output format
    {
      $project: {
        _id: 0,                         // Exclude MongoDB _id
        slo: '$_id',                    // Rename _id to slo
        accuracy: 1                     // Include accuracy percentage
      }
    }
  ]);

  // Return array of SLO accuracy results
  res.json(results);
});

// Controller function for topic-based accuracy analysis
// Student-only endpoint showing performance breakdown by subject topics
export const topicAccuracy = asyncHandler(async (req, res) => {
  // Get current student's ID from JWT token
  const studentId = req.user.id;

  // Get all quiz attempts for this student
  const attempts = await QuizAttempt.find({ student_id: studentId }).select('_id');

  // Extract attempt IDs for aggregation pipeline
  const attemptIds = attempts.map(a => a._id);

  // Aggregate quiz results by topic using MongoDB aggregation pipeline
  const results = await QuizResult.aggregate([
    // Match only results from this student's attempts
    { $match: { attempt_id: { $in: attemptIds } } },

    // Join with questions collection to get topics
    {
      $lookup: {
        from: 'questions',              // Collection to join
        localField: 'question_id',      // Field from QuizResult
        foreignField: '_id',            // Field from questions
        as: 'question'                  // Output array field name
      }
    },

    // Unwind the question array
    { $unwind: '$question' },

    // Filter out questions without topics
    { $match: { 'question.topic': { $ne: null, $exists: true } } },

    // Group by topic and calculate accuracy percentage
    {
      $group: {
        _id: '$question.topic',         // Group by topic
        // Calculate accuracy: 100 if correct, 0 if incorrect, then average
        accuracy: { $avg: { $cond: ['$correct', 100, 0] } }
      }
    },

    // Project final output format
    {
      $project: {
        _id: 0,                         // Exclude MongoDB _id
        topic: '$_id',                  // Rename _id to topic
        accuracy: 1                     // Include accuracy percentage
      }
    }
  ]);

  // Return array of topic accuracy results
  res.json(results);
});

// Controller function for system-wide overview statistics
// Admin-only endpoint showing overall system metrics
export const systemOverview = asyncHandler(async (req, res) => {
  // Execute multiple count queries in parallel using Promise.all
  // This is more efficient than running them sequentially
  const [total_users, total_students, total_notes, total_lectures, total_quizzes, total_attempts] = await Promise.all([
    User.countDocuments(),                       // Count all users
    User.countDocuments({ role: 'student' }),    // Count only students
    Note.countDocuments(),                       // Count all notes
    Lecture.countDocuments(),                    // Count all lectures
    Quiz.countDocuments(),                       // Count all quizzes
    QuizAttempt.countDocuments()                 // Count all quiz attempts
  ]);

  // Return comprehensive system statistics
  res.json({
    total_users,      // Total registered users
    total_students,   // Total students only
    total_notes,      // Total uploaded notes
    total_lectures,   // Total uploaded lectures
    total_quizzes,    // Total created quizzes
    total_attempts    // Total quiz attempts
  });
});

// Controller function for detailed admin analytics dashboard
// Admin-only endpoint providing comprehensive performance insights
export const getAdminAnalytics = asyncHandler(async (req, res) => {
  // 1. Top Performing Students (by average percentage score)
  const topStudents = await QuizAttempt.aggregate([
    // Group attempts by student and calculate averages
    {
      $group: {
        _id: '$student_id',                    // Group by student ID
        avgScore: { $avg: '$percentage' },     // Average percentage score
        attempts: { $sum: 1 }                  // Count number of attempts
      }
    },

    // Sort by highest average score
    { $sort: { avgScore: -1 } },

    // Limit to top 5 students
    { $limit: 5 },

    // Join with users collection to get student details
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'student'
      }
    },

    // Unwind student array
    { $unwind: '$student' },

    // Project final format with readable fields
    {
      $project: {
        _id: 1,
        name: '$student.name',                          // Student name
        email: '$student.email',                        // Student email
        avgScore: { $round: ['$avgScore', 1] },        // Round to 1 decimal
        attempts: 1                                     // Number of attempts
      }
    }
  ]);

  // 2. Quiz Performance (Average score per quiz)
  const quizPerformance = await QuizAttempt.aggregate([
    // Group attempts by quiz and calculate averages
    {
      $group: {
        _id: '$quiz_id',                       // Group by quiz ID
        avgScore: { $avg: '$percentage' },     // Average percentage score
        attempts: { $sum: 1 }                  // Count number of attempts
      }
    },

    // Sort by most attempted quizzes first
    { $sort: { attempts: -1 } },

    // Limit to top 10 quizzes
    { $limit: 10 },

    // Join with quizzes collection to get quiz details
    {
      $lookup: {
        from: 'quizzes',
        localField: '_id',
        foreignField: '_id',
        as: 'quiz'
      }
    },

    // Unwind quiz array
    { $unwind: '$quiz' },

    // Project final format with readable fields
    {
      $project: {
        title: '$quiz.title',                           // Quiz title
        avgScore: { $round: ['$avgScore', 1] },        // Round to 1 decimal
        attempts: 1                                     // Number of attempts
      }
    }
  ]);

  // 3. Daily Activity (Quiz attempts over last 7 days)
  // Calculate date 7 days ago
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Aggregate attempts by day
  const dailyActivity = await QuizAttempt.aggregate([
    // Match only attempts from last 7 days
    { $match: { createdAt: { $gte: sevenDaysAgo } } },

    // Group by date (formatted as YYYY-MM-DD)
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 }                    // Count attempts for each day
      }
    },

    // Sort by date ascending (oldest to newest)
    { $sort: { _id: 1 } }
  ]);

  // Return comprehensive analytics data
  res.json({
    topStudents,        // Top 5 performing students
    quizPerformance,    // Top 10 most attempted quizzes with average scores
    dailyActivity       // Daily attempt counts for last 7 days
  });
});
