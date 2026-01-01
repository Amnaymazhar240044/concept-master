// Import async handler wrapper for error handling
import { asyncHandler } from '../utils/asyncHandler.js';

// Import pagination utility
import { getPagination } from '../utils/pagination.js';

// Import all models needed for quiz operations
import { Quiz, Question, Subject, Class, User, QuizAttempt, QuizResult, Notification } from '../models/index.js';

// Import AI grading function for short answer quizzes
import { gradeQuiz } from './ai.controller.js';
import { checkFeatureAccess } from './featureControl.controller.js';

// Controller function to create a new quiz
// Admin-only endpoint for creating MCQ or short answer quizzes
// Note: Not using asyncHandler to implement custom error handling with debugging
export const createQuiz = async (req, res, next) => {
  try {
    // Debug: Check if models are properly loaded
    console.log('createQuiz - Models check:', {
      Quiz: !!Quiz,
      Notification: !!Notification,
      User: !!User
    });

    // Destructure quiz data from request body
    const { title, description, duration_minutes, subject_id, class_id, status, type } = req.body;

    // Debug logging
    console.log('createQuiz - Request body:', req.body);
    console.log('createQuiz - User:', req.user);

    // Validate user authentication
    if (!req.user || !req.user.id) {
      throw new Error('User not authenticated or missing ID');
    }

    // Validate Quiz model is loaded
    if (!Quiz) throw new Error('Quiz model is undefined');

    // Create new quiz document in database
    const quiz = await Quiz.create({
      title,                                  // Quiz title
      description,                            // Quiz description
      duration_minutes,                       // Time limit in minutes
      subject_id: subject_id || null,         // Optional subject reference
      class_id: class_id || null,             // Optional class reference
      status: status || 'draft',              // Default to draft status
      type: type || 'MCQ',                    // Default to MCQ type
      created_by: req.user.id,                // Admin who created the quiz
    });

    // Send notification to students if quiz is published immediately
    if (quiz.status === 'published') {
      // Check if Notification model is loaded
      if (Notification) {
        // Create notification for all students
        await Notification.create({
          title: 'New Quiz',                         // Notification title
          message: `${quiz.title} is available`,     // Notification message
          type: 'quiz_published',                    // Notification type
          to_role: 'student',                        // Broadcast to all students
          created_by: req.user.id                    // Admin who created the quiz
        });
      } else {
        // Warn if Notification model unavailable (shouldn't happen in production)
        console.warn('Notification model is undefined, skipping notification');
      }
    }

    // Debug: Log created quiz
    console.log('createQuiz - Created quiz:', JSON.stringify(quiz, null, 2))

    // Return 201 Created with quiz data
    res.status(201).json(quiz);
  } catch (error) {
    // Log error for debugging
    console.error('createQuiz error:', error);

    // Return detailed error message to client
    // Include stack trace only in development environment
    res.status(500).json({
      message: error.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Controller function to list quizzes with filtering and pagination
// Accessible to all authenticated users with role-based filtering
export const listQuizzes = asyncHandler(async (req, res) => {
  // Check feature access
  const hasAccess = await checkFeatureAccess('quizzes', req.user);
  if (!hasAccess) {
    return res.status(403).json({
      message: 'This is a premium feature. Please upgrade to access quizzes.',
      code: 'PREMIUM_REQUIRED'
    });
  }

  // Extract pagination parameters
  const { page, limit, offset } = getPagination(req.query);

  // Build filter object for database query
  const where = {};

  // Add subject filter if provided
  if (req.query.subject_id) where.subject_id = req.query.subject_id;

  // Add class filter if provided
  if (req.query.class_id) where.class_id = req.query.class_id;

  // Students, parents, and guests (unauthenticated) can only see published quizzes
  if (!req.user || req.user.role === 'student' || req.user.role === 'parent') {
    where.status = 'published';
  }

  // Filter for teachers to see only their own quizzes
  // Note: Teacher role is legacy, admin role has inherited this functionality
  if (req.user?.role === 'teacher') where.created_by = req.user.id;

  // Debug logging
  console.log('listQuizzes - Query params:', req.query);
  console.log('listQuizzes - Where clause:', where);
  console.log('listQuizzes - User role:', req.user?.role);

  // Count total quizzes matching filter
  const total = await Quiz.countDocuments(where);

  // Query quizzes with filter, population, sorting, and pagination
  const quizzes = await Quiz.find(where)
    .populate('subject_id')               // Populate subject details
    .populate('class_id')                 // Populate class details
    .populate('created_by', 'id name')    // Populate creator name/ID
    .sort({ _id: -1 })                    // Sort by newest first
    .skip(offset)                         // Skip records for pagination
    .limit(limit);                        // Limit results per page

  // Note: Questions are not populated in list view for performance
  // Questions can be fetched separately when viewing individual quiz
  // Mongoose doesn't support partial population of virtuals easily

  // Debug: Log result count
  console.log('listQuizzes - Found quizzes count:', total);

  // Return paginated response
  res.json({ total, page, limit, data: quizzes });
});

// Controller function to get a single quiz with questions
// Protected endpoint with role-based field filtering
export const getQuiz = asyncHandler(async (req, res) => {
  // Check feature access
  const hasAccess = await checkFeatureAccess('quizzes', req.user);
  if (!hasAccess) {
    return res.status(403).json({
      message: 'This is a premium feature. Please upgrade to access quizzes.',
      code: 'PREMIUM_REQUIRED'
    });
  }

  // Check if user is a student or parent
  const isStudent = req.user?.role === 'student' || req.user?.role === 'parent';

  // Find quiz by ID and populate related data
  const quiz = await Quiz.findById(req.params.id)
    .populate('subject_id')               // Populate subject details
    .populate('class_id')                 // Populate class details
    .populate('created_by', 'id name');   // Populate creator name/ID

  // Return 404 if quiz not found
  if (!quiz) return res.status(404).json({ message: 'Not found' });

  // Fetch all questions for this quiz
  // For students: Hide correct_option_index to prevent cheating
  // For admins: Return all fields including correct answers
  const questions = await Question.find({ quiz_id: quiz._id })
    .select(isStudent ? 'id text options slo_tag topic difficulty' : '');

  // Convert quiz to plain object for modification
  const quizData = quiz.toObject();

  // Include questions only for students (for quiz taking)
  // Admins can fetch questions separately via listQuestions endpoint
  if (isStudent) {
    quizData.questions = questions;
  }

  // Debug: Log quiz data
  console.log('getQuiz - Quiz data:', JSON.stringify(quizData, null, 2))

  // Return quiz data
  res.json(quizData);
});

// Controller function to update a quiz
// Protected endpoint - only quiz owner or admin can update
export const updateQuiz = asyncHandler(async (req, res) => {
  // Find quiz by ID
  const quiz = await Quiz.findById(req.params.id);

  // Return 404 if quiz not found
  if (!quiz) return res.status(404).json({ message: 'Not found' });

  // Check ownership - quiz creator or admin can update
  const isOwner = quiz.created_by.toString() === req.user.id;

  // Return 403 Forbidden if user is not owner and not admin
  if (req.user.role !== 'admin' && !isOwner) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Store previous status for notification logic
  const prevStatus = quiz.status;

  // Update allowed fields
  const fields = ['title', 'description', 'duration_minutes', 'subject_id', 'class_id', 'status'];
  for (const f of fields) {
    if (req.body[f] !== undefined) quiz[f] = req.body[f];
  }

  // Save updated quiz to database
  await quiz.save();

  // Send notification if quiz status changed from non-published to published
  if (prevStatus !== 'published' && quiz.status === 'published') {
    await Notification.create({
      title: 'New Quiz',                         // Notification title
      message: `${quiz.title} is available`,     // Notification message
      type: 'quiz_published',                    // Notification type
      to_role: 'student',                        // Broadcast to all students
      created_by: req.user.id                    // Admin who published the quiz
    });
  }

  // Return updated quiz data
  res.json(quiz);
});

// Controller function to delete a quiz
// Protected endpoint - only quiz owner or admin can delete
export const deleteQuiz = asyncHandler(async (req, res) => {
  // Find quiz by ID
  const quiz = await Quiz.findById(req.params.id);

  // Return 404 if quiz not found
  if (!quiz) return res.status(404).json({ message: 'Not found' });

  // Check ownership - quiz creator or admin can delete
  const isOwner = quiz.created_by.toString() === req.user.id;

  // Return 403 Forbidden if user is not owner and not admin
  if (req.user.role !== 'admin' && !isOwner) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Delete quiz from database
  await quiz.deleteOne();

  // Cascade delete - also delete all questions associated with this quiz
  await Question.deleteMany({ quiz_id: quiz._id });

  // Return success message
  res.json({ message: 'Deleted' });
});

// Controller function to add a question to a quiz
// Admin-only endpoint with validation for MCQ questions
export const addQuestion = asyncHandler(async (req, res) => {
  // Destructure question data from request body
  const { text, options, correct_option_index, slo_tag, topic, difficulty } = req.body;

  // Find parent quiz
  const quiz = await Quiz.findById(req.params.quizId);

  // Return 404 if quiz not found
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

  // Check ownership - quiz creator or admin can add questions
  const isOwner = quiz.created_by.toString() === req.user.id;

  // Return 403 Forbidden if user is not owner and not admin
  if (req.user.role !== 'admin' && !isOwner) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Validate MCQ-specific fields
  if (quiz.type === 'MCQ') {
    // Options must be an array with at least 2 choices
    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: 'Options must be an array of length >= 2 for MCQ' });
    }

    // Correct option index is required for MCQ questions
    if (correct_option_index === undefined || correct_option_index === null) {
      return res.status(400).json({ message: 'Correct option index is required for MCQ' });
    }
  }

  // Create new question document
  const q = await Question.create({
    quiz_id: quiz._id,              // Reference to parent quiz
    text,                           // Question text
    options,                        // Answer options (for MCQ)
    correct_option_index,           // Correct answer index (for MCQ)
    slo_tag,                        // Student Learning Outcome tag
    topic,                          // Subject topic
    difficulty                      // Question difficulty level
  });

  // Return 201 Created with question data
  res.status(201).json(q);
});

// Controller function to list all questions in a quiz
// Admin-only endpoint for viewing/managing quiz questions
export const listQuestions = asyncHandler(async (req, res) => {
  // Find parent quiz
  const quiz = await Quiz.findById(req.params.quizId);

  // Return 404 if quiz not found
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

  // Query all questions for this quiz, sorted by creation order
  const questions = await Question.find({ quiz_id: quiz._id }).sort({ _id: 1 });

  // Return questions array
  res.json(questions);
});

// Controller function to submit a quiz attempt
// Student-only premium endpoint for attempting quizzes
// Handles both MCQ (automatic grading) and SHORT_ANSWER (AI grading) quiz types
export const submitAttempt = asyncHandler(async (req, res) => {
  // Check feature access
  const hasAccess = await checkFeatureAccess('quizzes', req.user);
  if (!hasAccess) {
    return res.status(403).json({
      message: 'This is a premium feature. Please upgrade to access quizzes.',
      code: 'PREMIUM_REQUIRED'
    });
  }

  // Extract answers array from request body
  // MCQ format: [{question_id, selected_option_index}]
  // SHORT_ANSWER format: [{question_id, answer_text}]
  const { answers } = req.body;

  // Find quiz by ID
  const quiz = await Quiz.findById(req.params.quizId);

  // Return 404 if quiz not found
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

  // Only published quizzes can be attempted
  if (quiz.status !== 'published') {
    return res.status(403).json({ message: 'Quiz not available' });
  }

  // Check if quiz deadline has passed
  if (quiz.deadline && new Date() > new Date(quiz.deadline)) {
    return res.status(403).json({ message: 'Quiz deadline has passed' });
  }

  // Check specific feature access for Short Answer quizzes
  if (quiz.type === 'SHORT_ANSWER') {
    const hasShortAnswerAccess = await checkFeatureAccess('shortAnswerQuiz', req.user);
    if (!hasShortAnswerAccess) {
      return res.status(403).json({
        message: 'This is a premium feature. Please upgrade to access Short Answer quizzes.',
        code: 'PREMIUM_REQUIRED'
      });
    }
  }

  // Check if student has already attempted this quiz
  // Each student can only attempt a quiz once
  const existingAttempt = await QuizAttempt.findOne({
    quiz_id: quiz._id,
    student_id: req.user.id
  });

  // Return 403 if student already attempted this quiz
  if (existingAttempt) {
    return res.status(403).json({ message: 'You have already attempted this quiz' });
  }

  // Fetch all questions for this quiz
  const questions = await Question.find({ quiz_id: quiz._id });

  // Create a Map for O(1) question lookup by ID
  const qMap = new Map(questions.map(q => [q._id.toString(), q]));

  // Initialize correct answer counter
  let correctCount = 0;

  // Create quiz attempt record with initial data
  const attempt = await QuizAttempt.create({
    quiz_id: quiz._id,           // Reference to quiz
    student_id: req.user.id      // Reference to student
  });

  // Handle SHORT_ANSWER quiz type with AI grading
  if (quiz.type === 'SHORT_ANSWER') {
    // Prepare data for AI grading
    // Format: [{question_id, question, answer}]
    const questionsForAI = [];

    // Process each submitted answer
    for (const a of answers || []) {
      // Get corresponding question
      const q = qMap.get(a.question_id);

      // Skip if question not found
      if (q) {
        // Add to AI grading input
        questionsForAI.push({
          question_id: q._id.toString(),   // String ID for matching
          question: q.text,                // Question text for AI context
          answer: a.answer_text            // Student's text answer
        });
      }
    }

    // Debug: Log AI grading input
    console.log('AI Grading - Input data:', JSON.stringify(questionsForAI, null, 2));

    // Call AI grading function
    let gradedResults;
    try {
      gradedResults = await gradeQuiz(questionsForAI);
    } catch (err) {
      // Log grading error
      console.error('Grading failed:', err);

      // Return 500 if AI grading fails
      return res.status(500).json({ message: 'AI Grading failed. Please try again.' });
    }

    // Extract correct count from AI grading results
    correctCount = gradedResults.obtained_marks;

    // Debug: Log grading results
    console.log('AI Grading - Results:', {
      correctCount,
      total: gradedResults.total_marks,
      questions: gradedResults.questions.length
    });

    // Save individual question results to database
    for (const res of gradedResults.questions) {
      await QuizResult.create({
        attempt_id: attempt._id,           // Link to quiz attempt
        question_id: res.question_id,      // Link to question
        correct: res.status === 'correct', // Boolean correctness
        student_answer_text: questionsForAI.find(q => q.question_id === res.question_id)?.answer,
        ai_feedback: {
          feedback: res.feedback,          // AI's detailed feedback
          status: res.status               // correct/incorrect status
        }
      });
    }

  } else {
    // Handle MCQ quiz type with automatic grading

    // Process each submitted answer
    for (const a of answers || []) {
      // Get corresponding question
      const q = qMap.get(a.question_id);

      // Skip if question not found
      if (!q) continue;

      // Check if selected option matches correct option
      const correct = q.correct_option_index === a.selected_option_index;

      // Increment counter if answer is correct
      if (correct) correctCount++;

      // Save individual question result
      await QuizResult.create({
        attempt_id: attempt._id,              // Link to quiz attempt
        question_id: q._id,                   // Link to question
        selected_option_index: a.selected_option_index,  // Student's selection
        correct                               // Boolean correctness
      });
    }
  }

  // Calculate final score and percentage
  const total = questions.length || 0;
  const percentage = total ? (correctCount / total) * 100 : 0;

  // Update attempt record with final scores
  attempt.score = correctCount;
  attempt.percentage = parseFloat(percentage.toFixed(2));  // Round to 2 decimals
  attempt.completed_at = new Date();                       // Set completion timestamp

  // Save updated attempt
  await attempt.save();

  // Send result notification to student
  await Notification.create({
    title: 'Result Published',                                      // Notification title
    message: `You scored ${correctCount}/${total} in ${quiz.title}`, // Score summary
    type: 'result',                                                 // Notification type
    to_user_id: req.user.id,                                        // Target student
    created_by: req.user.id                                         // Creator
  });

  // Return attempt summary
  res.status(201).json({
    attempt_id: attempt._id,       // Attempt ID for fetching details
    score: correctCount,           // Number of correct answers
    total,                         // Total questions
    percentage: attempt.percentage // Percentage score
  });
});

// Controller function to list all attempts for a specific quiz
// Admin-only endpoint for monitoring quiz performance
export const quizAttempts = asyncHandler(async (req, res) => {
  // Extract pagination parameters
  const { page, limit, offset } = getPagination(req.query);

  // Build filter for this specific quiz
  const where = { quiz_id: req.params.quizId };

  // Count total attempts for this quiz
  const total = await QuizAttempt.countDocuments(where);

  // Query attempts with pagination
  const attempts = await QuizAttempt.find(where)
    .populate('student_id', 'id name email')  // Populate student info
    .sort({ _id: -1 })                        // Sort by newest first
    .skip(offset)                             // Skip records for pagination
    .limit(limit);                            // Limit results per page

  // Return paginated response
  res.json({ total, page, limit, data: attempts });
});

// Controller function to list current student's quiz attempts
// Student-only endpoint for viewing personal quiz history
export const myAttempts = asyncHandler(async (req, res) => {
  // Extract pagination parameters
  const { page, limit, offset } = getPagination(req.query);

  // Count total attempts for current student
  const total = await QuizAttempt.countDocuments({ student_id: req.user.id });

  // Query student's attempts with pagination
  const attempts = await QuizAttempt.find({ student_id: req.user.id })
    .populate('quiz_id')        // Populate quiz details
    .sort({ _id: -1 })          // Sort by newest first
    .skip(offset)               // Skip records for pagination
    .limit(limit);              // Limit results per page

  // Return paginated response
  res.json({ total, page, limit, data: attempts });
});

// Controller function to get current student's attempt for a specific quiz
// Student-only endpoint for viewing own quiz results
export const getMyAttempt = asyncHandler(async (req, res) => {
  // Find student's attempt for this quiz
  const attempt = await QuizAttempt.findOne({
    quiz_id: req.params.quizId,   // Specific quiz
    student_id: req.user.id       // Current student
  })
    .populate('quiz_id');           // Populate quiz details

  // Return 404 if no attempt found
  if (!attempt) {
    return res.status(404).json({ message: 'No attempt found' });
  }

  // Fetch detailed results for each question in this attempt
  const results = await QuizResult.find({ attempt_id: attempt._id })
    .populate('question_id');  // Populate full question details

  // Convert attempt to plain object for modification
  const attemptData = attempt.toObject();

  // Add quiz results to attempt data
  attemptData.quiz_results = results;

  // Return comprehensive attempt data
  res.json(attemptData);
});
