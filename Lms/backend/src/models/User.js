// Import mongoose library for MongoDB object modeling and schema definition
import mongoose from 'mongoose';

// Define schema for User collection in MongoDB database
// This schema defines the structure and validation rules for user documents
const userSchema = new mongoose.Schema({
    // User's full name field
    name: {
        // Field must be a string data type
        type: String,

        // Name is required and cannot be omitted
        required: true,

        // Automatically remove leading and trailing whitespace
        trim: true
    },

    // User's email address field used for authentication and identification
    email: {
        // Field must be a string data type
        type: String,

        // Email is required for every user account
        required: true,

        // Email must be unique across all users in the database
        // MongoDB creates a unique index on this field
        unique: true,

        // Automatically convert email to lowercase for case-insensitive matching
        lowercase: true,

        // Remove leading and trailing whitespace
        trim: true
    },

    // Hashed password field for secure authentication
    password: {
        // Field must be a string (stores bcrypt hashed password)
        type: String,

        // Password is required for authentication
        // Never stored in plain text, always hashed before saving
        required: true
    },

    // User role field for role-based access control and permissions
    role: {
        // Field must be a string data type
        type: String,

        // Teacher and Parent roles have been removed from the system
        // Only 'student' and 'admin' roles are now supported
        // Admin role has inherited all teacher functionality
        enum: ['student', 'admin'],

        // Role is required to determine user permissions
        required: true,

        // Default role is 'student' for new registrations
        default: 'student'
    },

    // Premium subscription status for accessing premium features
    isPremium: {
        // Field must be a boolean value (true or false)
        type: Boolean,

        // Default to false meaning user is not premium subscriber
        // Admin can toggle this to grant premium access
        default: false
    },

    // Reference to the Class that this student belongs to
    class_id: {
        // Field stores MongoDB ObjectId reference
        type: mongoose.Schema.Types.ObjectId,

        // Reference links to the Class collection
        // Enables population of class details when querying users
        ref: 'Class'
    },

    // Timestamp of when the user account was created
    createdAt: {
        // Field must be a Date data type
        type: Date,

        // Automatically set to current date/time when document is created
        default: Date.now
    }
});

// Create and export User model based on the defined schema
// This model is used for database operations on the users collection
export const User = mongoose.model('User', userSchema);
