// Import mongoose library for MongoDB object modeling and schema definition
import mongoose from 'mongoose';

// Define schema for QuizResult collection storing individual question results
// Each document represents one question's answer within a quiz attempt
const quizResultSchema = new mongoose.Schema({
    // Reference to the QuizAttempt this result belongs to
    attempt_id: {
        // Field stores MongoDB ObjectId reference
        type: mongoose.Schema.Types.ObjectId,

        // Reference links to the QuizAttempt collection
        // Groups all question results for a single quiz submission
        ref: 'QuizAttempt',

        // Attempt reference is required for every result
        required: true
    },

    // Reference to the Question being answered
    question_id: {
        // Field stores MongoDB ObjectId reference
        type: mongoose.Schema.Types.ObjectId,

        // Reference links to the Question collection
        // Connects the result to its question definition
        ref: 'Question',

        // Question reference is required for every result
        required: true
    },

    // Index of the option selected by student (only for MCQ questions)
    selected_option_index: {
        // Field must be a number data type (0-based index)
        type: Number

        // Not required field - only populated for MCQ type quizzes
        // Short answer quizzes use student_answer_text instead
    },

    // Boolean flag indicating whether the answer is correct
    correct: {
        // Field must be a boolean value (true or false)
        type: Boolean,

        // Correct field is required to calculate quiz scores
        // Set automatically for MCQ, set by AI for short answer
        required: true
    },

    // Text answer provided by student (only for short answer questions)
    student_answer_text: {
        // Field must be a string data type
        // Stores the student's written response for AI grading
        type: String
    },

    // AI-generated feedback for short answer questions
    ai_feedback: {
        // Field can store any type (JSON object or string)
        // Contains detailed grading explanation from AI model
        type: mongoose.Schema.Types.Mixed
    }
});

// Create and export QuizResult model based on the defined schema
// This model is used for database operations on the quiz results collection
export const QuizResult = mongoose.model('QuizResult', quizResultSchema);
