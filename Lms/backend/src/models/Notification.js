// Import mongoose library for MongoDB object modeling and schema definition
import mongoose from 'mongoose';

// Define schema for Notification collection for user announcements and alerts
// Notifications can be targeted to specific users or broadcast to entire roles
const notificationSchema = new mongoose.Schema({
    // Title field for the notification headline
    title: {
        // Field must be a string data type
        type: String,

        // Title is required and cannot be omitted
        required: true,

        // Automatically remove leading and trailing whitespace
        trim: true
    },

    // Message field containing detailed notification content
    message: {
        // Field must be a string data type
        type: String
    },

    // Type field for categorizing notifications
    type: {
        // Field must be a string data type
        // Can be used to classify notification types like 'announcement', 'alert', etc.
        type: String
    },

    // Reference to specific User for targeted notifications
    to_user_id: {
        // Field stores MongoDB ObjectId reference
        type: mongoose.Schema.Types.ObjectId,

        // Reference links to the User collection
        // If set, notification is sent only to this user
        ref: 'User'
    },

    // Role-based targeting field for broadcast notifications
    to_role: {
        // Field must be a string data type
        // If set, notification is sent to all users with this role (e.g., 'student', 'admin')
        type: String
    },

    // Read status flag tracking whether user has viewed notification
    is_read: {
        // Field must be a boolean value (true or false)
        type: Boolean,

        // Default to false meaning notification is unread when created
        // User action marks notification as read
        default: false
    },

    // Reference to the User (admin) who created this notification
    created_by: {
        // Field stores MongoDB ObjectId reference
        type: mongoose.Schema.Types.ObjectId,

        // Reference links to the User collection
        // Tracks notification authorship
        ref: 'User',

        // Creator reference is required for every notification
        required: true
    },

    // Timestamp of when the notification was created
    createdAt: {
        // Field must be a Date data type
        type: Date,

        // Automatically set to current date/time when document is created
        default: Date.now
    }
});

// Create and export Notification model based on the defined schema
// This model is used for database operations on the notifications collection
export const Notification = mongoose.model('Notification', notificationSchema);
