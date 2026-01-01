// Import mongoose library for MongoDB object modeling and schema definition
import mongoose from 'mongoose';

// Define schema for Question collection representing individual quiz questions
// Questions can be MCQ (with options) or short answer (without options)
const questionSchema = new mongoose.Schema({
    // Reference to the Quiz this question belongs to
    quiz_id: {
        // Field stores MongoDB ObjectId reference
        type: mongoose.Schema.Types.ObjectId,

        // Reference links to the Quiz collection
        // Enables grouping questions by their parent quiz
        ref: 'Quiz',

        // Quiz reference is required for every question
        required: true
    },

    // Question text field containing the actual question
    text: {
        // Field must be a string data type
        type: String,

        // Question text is required and cannot be omitted
        required: true
    },

    // Array of answer options for MCQ questions
    options: {
        // Field must be an array of strings
        type: [String],

        // Validation moved to controller logic based on quiz type
        // For MCQ questions, options are required
        // For short answer questions, options are not needed
        // required: true,

        // Optional validator to ensure at least 2 options provided
        // validate: [arrayLimit, '{PATH} must have at least 2 options']
    },

    // Index of the correct answer in the options array (for MCQ)
    correct_option_index: {
        // Field must be a number data type (0-based index)
        type: Number,

        // Validation moved to controller based on quiz type
        // Required for MCQ questions to identify correct answer
        // Not needed for short answer questions (AI grades those)
        // required: true
    },

    // Optional SLO (Student Learning Outcome) tag for categorization
    slo_tag: {
        // Field must be a string data type
        // Used to align questions with specific learning outcomes
        type: String
    },

    // Optional topic field to categorize questions by subject topic
    topic: {
        // Field must be a string data type
        type: String
    },

    // Difficulty level field for question classification
    difficulty: {
        // Field must be a string data type
        type: String,

        // Only allow 'easy', 'medium', or 'hard' difficulty levels
        enum: ['easy', 'medium', 'hard'],

        // Default difficulty is 'medium' for new questions
        default: 'medium'
    }
});

// Helper function to validate that options array has at least 2 elements
// This ensures MCQ questions have sufficient answer choices
function arrayLimit(val) {
    // Return true if array length is 2 or more, false otherwise
    return val.length >= 2;
}

// Create and export Question model based on the defined schema
// This model is used for database operations on the questions collection
export const Question = mongoose.model('Question', questionSchema);
