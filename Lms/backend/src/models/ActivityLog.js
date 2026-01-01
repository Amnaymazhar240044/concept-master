// Import mongoose library for MongoDB object modeling and schema definition
import mongoose from 'mongoose';

// Define schema for ActivityLog collection for tracking user actions and system events
// Activity logs provide audit trail for security and debugging purposes
const activityLogSchema = new mongoose.Schema({
    // Reference to the User who performed the action
    user_id: {
        // Field stores MongoDB ObjectId reference
        type: mongoose.Schema.Types.ObjectId,

        // Reference links to the User collection
        // Associates activity with specific user for accountability
        ref: 'User',

        // User reference is required to identify who performed the action
        required: true
    },

    // Action description field describing what was done
    action: {
        // Field must be a string data type
        // Examples: 'login', 'quiz_attempted', 'note_uploaded', etc.
        type: String,

        // Action description is required to identify the event
        required: true
    },

    // Metadata field storing additional contextual information
    meta: {
        // Field can store any type (JSON object, string, array, etc.)
        // Can contain action-specific details like quiz ID, score, timestamps, etc.
        type: mongoose.Schema.Types.Mixed
    },

    // Timestamp of when the activity occurred
    createdAt: {
        // Field must be a Date data type
        type: Date,

        // Automatically set to current date/time when log entry is created
        default: Date.now
    }
});

// Create and export ActivityLog model based on the defined schema
// This model is used for database operations on the activity logs collection
export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
