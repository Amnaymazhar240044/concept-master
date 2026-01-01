// Import mongoose library for MongoDB object modeling and schema definition
import mongoose from 'mongoose';

// Define schema for Class collection representing academic grade levels
// Classes represent grades 9-12 in the education system
const classSchema = new mongoose.Schema({
    // Title field for the class name (e.g., "Class 9", "Class 10")
    title: {
        // Field must be a string data type
        type: String,

        // Title is required and cannot be omitted
        required: true,

        // Automatically remove leading and trailing whitespace
        trim: true
    }
});

// Create and export Class model based on the defined schema
// This model is used for database operations on the classes collection
export const Class = mongoose.model('Class', classSchema);
