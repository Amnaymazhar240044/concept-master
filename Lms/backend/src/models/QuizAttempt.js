// Import mongoose library for MongoDB object modeling and schema definition
import mongoose from 'mongoose';

// Define schema for QuizAttempt collection tracking student quiz submissions
// Each document represents one complete attempt at taking a quiz
const quizAttemptSchema = new mongoose.Schema({
    // Reference to the Quiz being attempted
    quiz_id: {
        // Field stores MongoDB ObjectId reference
        type: mongoose.Schema.Types.ObjectId,

        // Reference links to the Quiz collection
        // Identifies which quiz this attempt is for
        ref: 'Quiz',

        // Quiz reference is required for every attempt
        required: true
    },

    // Reference to the User (student) taking the quiz
    student_id: {
        // Field stores MongoDB ObjectId reference
        type: mongoose.Schema.Types.ObjectId,

        // Reference links to the User collection
        // Tracks which student made this attempt
        ref: 'User',

        // Student reference is required for every attempt
        required: true
    },

    // Total score achieved on the quiz (number of correct answers)
    score: {
        // Field must be a number data type
        type: Number,

        // Default score is 0, updated after grading completes
        default: 0
    },

    // Percentage score achieved on the quiz
    percentage: {
        // Field must be a number data type (0-100)
        type: Number,

        // Default percentage is 0, calculated from score/total questions
        default: 0
    },

    // Timestamp when the student started the quiz
    started_at: {
        // Field must be a Date data type
        type: Date,

        // Automatically set to current date/time when attempt begins
        // Used to enforce quiz duration limits
        default: Date.now
    },

    // Timestamp when the student completed and submitted the quiz
    completed_at: {
        // Field must be a Date data type
        // Initially null, set when quiz is submitted
        type: Date
    }
});

// Create and export QuizAttempt model based on the defined schema
// This model is used for database operations on the quiz attempts collection
export const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);
