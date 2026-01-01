// Import mongoose library for MongoDB object modeling and schema definition
import mongoose from 'mongoose';

// Define schema for Lecture collection representing educational video content
// Lectures can be uploaded files or external links (e.g., YouTube)
const lectureSchema = new mongoose.Schema({
    // Title field for the lecture name
    title: {
        // Field must be a string data type
        type: String,

        // Lecture title is required and cannot be omitted
        required: true,

        // Automatically remove leading and trailing whitespace
        trim: true
    },

    // Optional description providing details about lecture content
    description: {
        // Field must be a string data type
        type: String
    },

    // Type field indicating whether lecture is a file upload or external link
    type: {
        // Field must be a string data type
        type: String,

        // Only allow 'file' (uploaded video) or 'link' (YouTube/external) types
        enum: ['file', 'link'],

        // Type is required to determine how to display the lecture
        required: true
    },

    // Path to uploaded lecture file on server (for type='file')
    file_path: {
        // Field must be a string data type
        // Contains relative path to uploaded video file
        type: String
    },

    // External link URL (for type='link'
    link: {
        // Field must be a string data type
        // Contains full URL to video (e.g., YouTube embed link)
        type: String
    },

    // Reference to the Subject this lecture belongs to
    subject_id: {
        // Field stores MongoDB ObjectId reference
        type: mongoose.Schema.Types.ObjectId,

        // Reference links to the Subject collection
        // Enables organizing lectures by subject
        ref: 'Subject'
    },

    // Reference to the Class this lecture is intended for
    class_id: {
        // Field stores MongoDB ObjectId reference
        type: mongoose.Schema.Types.ObjectId,

        // Reference links to the Class collection
        // Enables filtering lectures by grade level
        ref: 'Class'
    },

    // Reference to the Chapter this lecture belongs to
    chapter_id: {
        // Field stores MongoDB ObjectId reference
        type: mongoose.Schema.Types.ObjectId,

        // Reference links to the Chapter collection
        // Groups lectures within specific chapters
        ref: 'Chapter'
    },

    // Reference to the User (admin) who uploaded this lecture
    uploaded_by: {
        // Field stores MongoDB ObjectId reference
        type: mongoose.Schema.Types.ObjectId,

        // Reference links to the User collection
        // Tracks lecture authorship
        ref: 'User',

        // Uploader reference is required for every lecture
        required: true
    },

    // Approval status field for content moderation
    approved: {
        // Field must be a boolean value (true or false)
        type: Boolean,

        // Default to false meaning lectures need admin approval before being visible
        // Admin can toggle this to publish lectures to students
        default: false
    },

    // Premium access control field
    // Determines if lecture requires premium subscription to view
    isPremium: {
        // Field must be a boolean value (true or false)
        type: Boolean,

        // Default to false making lectures accessible to all users
        // Premium lectures (isPremium: true) require user.isPremium to view
        default: false
    },

    // Timestamp of when the lecture was created
    createdAt: {
        // Field must be a Date data type
        type: Date,

        // Automatically set to current date/time when document is created
        default: Date.now
    }
});

// Create and export Lecture model based on the defined schema
// This model is used for database operations on the lectures collection
export const Lecture = mongoose.model('Lecture', lectureSchema);
