// Import mongoose library for MongoDB object modeling and schema definition
import mongoose from 'mongoose';

// Import Chapter model (though not actively used in this file currently)
import { Chapter } from './Chapter.js';

// Define schema for Note collection representing study material PDFs
// Notes are uploaded by admins and require approval before being visible to students
const noteSchema = new mongoose.Schema({
    // Title field for the note
    title: {
        // Field must be a string data type
        type: String,

        // Note title is required and cannot be omitted
        required: true,

        // Automatically remove leading and trailing whitespace
        trim: true
    },

    // Optional description providing details about note content
    description: {
        // Field must be a string data type
        type: String
    },

    // Reference to the Subject this note belongs to
    subject_id: {
        // Field stores MongoDB ObjectId reference
        type: mongoose.Schema.Types.ObjectId,

        // Reference links to the Subject collection
        // Enables organizing notes by subject
        ref: 'Subject'
    },

    // Reference to the Class this note is intended for
    class_id: {
        // Field stores MongoDB ObjectId reference
        type: mongoose.Schema.Types.ObjectId,

        // Reference links to the Class collection
        // Enables filtering notes by grade level
        ref: 'Class'
    },

    // Reference to the Chapter this note belongs to
    chapter_id: {
        // Field stores MongoDB ObjectId reference
        type: mongoose.Schema.Types.ObjectId,

        // Reference links to the Chapter collection
        // Groups notes within specific chapters
        ref: 'Chapter'
    },

    // Path to uploaded note file on server
    file_path: {
        // Field must be a string data type
        type: String,

        // File path is required as notes are file-based resources
        // Contains relative path to PDF or document file
        required: true
    },

    // Original filename of the uploaded note
    file_name: {
        // Field must be a string data type
        // Stores original filename for display purposes
        type: String
    },

    // Reference to the User (admin) who uploaded this note
    uploaded_by: {
        // Field stores MongoDB ObjectId reference
        type: mongoose.Schema.Types.ObjectId,

        // Reference links to the User collection
        // Tracks note authorship
        ref: 'User',

        // Uploader reference is required for every note
        required: true
    },

    // Approval status field for content moderation
    approved: {
        // Field must be a boolean value (true or false)
        type: Boolean,

        // Default to false meaning notes need admin approval before being publicly visible
        // Admin can toggle this to publish notes to all students
        default: false
    },

    // Timestamp of when the note was created
    createdAt: {
        // Field must be a Date data type
        type: Date,

        // Automatically set to current date/time when document is created
        default: Date.now
    }
});

// Create and export Note model based on the defined schema
// This model is used for database operations on the notes collection
export const Note = mongoose.model('Note', noteSchema);
