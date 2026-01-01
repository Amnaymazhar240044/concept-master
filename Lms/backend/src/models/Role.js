// Import mongoose library for MongoDB object modeling and schema definition
import mongoose from 'mongoose';

// Define schema for Role collection for managing user roles
// Note: This model appears to be legacy - roles are now embedded in User model
const roleSchema = new mongoose.Schema({
    // Role name field for the role identifier
    role_name: {
        // Field must be a string data type
        type: String,

        // Role name is required and cannot be omitted
        required: true,

        // Role name must be unique across all roles
        // Prevents duplicate role definitions
        unique: true,

        // Automatically remove leading and trailing whitespace
        trim: true
    }
});

// Create and export Role model based on the defined schema
// This model is used for database operations on the roles collection
export const Role = mongoose.model('Role', roleSchema);
