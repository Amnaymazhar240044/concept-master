// Import mongoose library for MongoDB object modeling and schema definition
import mongoose from 'mongoose';

// Define schema for Subject collection representing academic subjects
// Subjects can include Mathematics, Physics, Chemistry, Biology, etc.
const subjectSchema = new mongoose.Schema({
    // Name field for the subject (e.g., "Mathematics", "Physics")
    name: {
        // Field must be a string data type
        type: String,

        // Subject name is required and cannot be omitted
        required: true,

        // Subject name must be unique across all subjects
        // Prevents duplicate subjects from being created
        unique: true,

        // Automatically remove leading and trailing whitespace
        trim: true
    }
});

// Create and export Subject model based on the defined schema
// This model is used for database operations on the subjects collection
export const Subject = mongoose.model('Subject', subjectSchema);
