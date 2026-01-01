// Import mongoose library for MongoDB object modeling and schema definition
import mongoose from 'mongoose';

// Define schema for Quiz collection representing assessments created by admin
// Quizzes can be MCQ (multiple choice) or short answer type with AI grading
const quizSchema = new mongoose.Schema({
    // Title field for the quiz name
    title: {
        // Field must be a string data type
        type: String,

        // Quiz title is required and cannot be omitted
        required: true,

        // Automatically remove leading and trailing whitespace
        trim: true
    },

    // Optional description providing details about the quiz content
    description: {
        // Field must be a string data type
        type: String
    },

    // Duration field specifying time limit for quiz completion in minutes
    duration_minutes: {
        // Field must be a number data type
        type: Number,

        // Duration is required to enforce time limits during quiz attempts
        required: true
    },

    // Reference to the Subject this quiz is associated with
    subject_id: {
        // Field stores MongoDB ObjectId reference
        type: mongoose.Schema.Types.ObjectId,

        // Reference links to the Subject collection
        // Enables filtering and organizing quizzes by subject
        ref: 'Subject'
    },

    // Reference to the Class this quiz is intended for
    class_id: {
        // Field stores MongoDB ObjectId reference
        type: mongoose.Schema.Types.ObjectId,

        // Reference links to the Class collection
        // Enables filtering and organizing quizzes by grade level
        ref: 'Class'
    },

    // Reference to the User (admin) who created this quiz
    created_by: {
        // Field stores MongoDB ObjectId reference
        type: mongoose.Schema.Types.ObjectId,

        // Reference links to the User collection
        // Tracks quiz authorship for accountability
        ref: 'User',

        // Creator reference is required for every quiz
        required: true
    },

    // Quiz publication status field
    status: {
        // Field must be a string data type
        type: String,

        // Only allow 'draft' or 'published' values
        // Draft quizzes are not visible to students
        enum: ['draft', 'published'],

        // Default status is 'draft' for new quizzes
        default: 'draft'
    },

    // Quiz type field determining question format and grading method
    type: {
        // Field must be a string data type
        type: String,

        // Only allow 'MCQ' (multiple choice) or 'SHORT_ANSWER' types
        // MCQ uses automatic grading, short answer uses AI grading
        enum: ['MCQ', 'SHORT_ANSWER'],

        // Default type is 'MCQ' for traditional multiple choice quizzes
        default: 'MCQ'
    },

    // Optional deadline field for quiz submission
    deadline: {
        // Field must be a Date data type
        // If set, students cannot attempt quiz after this date
        type: Date
    },

    // Timestamp of when the quiz was created
    createdAt: {
        // Field must be a Date data type
        type: Date,

        // Automatically set to current date/time when document is created
        default: Date.now
    },

    // Timestamp of when the quiz was last updated
    updatedAt: {
        // Field must be a Date data type
        type: Date,

        // Automatically set to current date/time when document is created
        default: Date.now
    }
});

// Pre-save hook to automatically update the updatedAt timestamp
// This code is commented out but could be uncommented to enable automatic timestamp updates
// quizSchema.pre('save', function (next) {
//     // Set updatedAt to current timestamp before saving
//     this.updatedAt = Date.now();
//     
//     // Call next to continue with save operation
//     next();
// });

// Create and export Quiz model based on the defined schema
// This model is used for database operations on the quizzes collection
export const Quiz = mongoose.model('Quiz', quizSchema);
