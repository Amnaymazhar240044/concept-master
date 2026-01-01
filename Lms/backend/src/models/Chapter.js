// Import mongoose library for MongoDB object modeling and schema definition
import mongoose from 'mongoose';

// Define schema for Chapter collection representing book chapters within subjects
// Chapters belong to both a subject and a class for organizational hierarchy
const chapterSchema = new mongoose.Schema({
    // Title field for the chapter name
    title: {
        // Field must be a string data type
        type: String,

        // Chapter title is required and cannot be omitted
        required: true,

        // Automatically remove leading and trailing whitespace
        trim: true
    },

    // Reference to the Subject this chapter belongs to
    subject_id: {
        // Field stores MongoDB ObjectId reference
        type: mongoose.Schema.Types.ObjectId,

        // Reference links to the Subject collection
        // Enables population of subject details when querying chapters
        ref: 'Subject',

        // Subject reference is required for every chapter
        required: true
    },

    // Reference to the Class this chapter belongs to
    class_id: {
        // Field stores MongoDB ObjectId reference
        type: mongoose.Schema.Types.ObjectId,

        // Reference links to the Class collection
        // Enables population of class details when querying chapters
        ref: 'Class',

        // Class reference is required for every chapter
        required: true
    },

    // Order field to maintain chapter sequence within a subject
    order: {
        // Field must be a number data type
        type: Number,

        // Default order is 0, admin can update to organize chapters
        default: 0
    },

    // Timestamp of when the chapter was created
    createdAt: {
        // Field must be a Date data type
        type: Date,

        // Automatically set to current date/time when document is created
        default: Date.now
    }
});

// Create compound index to ensure unique chapter names within a subject and class combination
// This prevents duplicate chapters like "Chapter 1" in same subject and class
// The index uses ascending order (1) for all three fields
chapterSchema.index({ title: 1, subject_id: 1, class_id: 1 }, { unique: true });

// Create and export Chapter model based on the defined schema
// This model is used for database operations on the chapters collection
export const Chapter = mongoose.model('Chapter', chapterSchema);
