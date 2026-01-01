// Import mongoose library for MongoDB object modeling and schema definition
import mongoose from 'mongoose';

// Define schema for Book collection representing educational books available for purchase
// Books include metadata for e-commerce functionality like pricing and ratings
const bookSchema = new mongoose.Schema({
    // Title field for the book name
    title: {
        // Field must be a string data type
        type: String,

        // Book title is required and cannot be omitted
        required: true,

        // Automatically remove leading and trailing whitespace
        trim: true
    },

    // Author field for the book writer's name
    author: {
        // Field must be a string data type
        type: String,

        // Author is required for every book
        required: true,

        // Automatically remove leading and trailing whitespace
        trim: true
    },

    // Price field for book cost in local currency
    price: {
        // Field must be a number data type
        type: Number,

        // Price is required for e-commerce functionality
        required: true,

        // Minimum price is 0, prevents negative pricing
        min: 0
    },

    // URL or path to book cover image
    coverImage: {
        // Field must be a string data type
        type: String,

        // Default to null if no cover image is uploaded
        default: null
    },

    // Category field for grouping books by subject or type
    category: {
        // Field must be a string data type
        type: String,

        // Default category is 'General' for uncategorized books
        default: 'General'
    },

    // Grade level field indicating target academic level
    grade: {
        // Field must be a string data type
        type: String,

        // Only allow specific grade values (9th, 10th, or intermediate years)
        // Aligns with Pakistani education system (Matric and FSc levels)
        enum: ['9th', '10th', '1st-year', '2nd-year'],

        // Grade is required to properly categorize books
        required: true
    },

    // Average rating field for book quality (out of 5 stars)
    rating: {
        // Field must be a number data type
        type: Number,

        // Default rating is 0 for new books without reviews
        default: 0,

        // Minimum rating is 0 stars
        min: 0,

        // Maximum rating is 5 stars
        max: 5
    },

    // Total number of reviews submitted for this book
    reviews: {
        // Field must be a number data type
        type: Number,

        // Default to 0 reviews for new books
        default: 0,

        // Cannot have negative number of reviews
        min: 0
    },

    // Detailed description field for book content and synopsis
    description: {
        // Field must be a string data type
        type: String,

        // Default to empty string if no description provided
        default: ''
    },

    // Array of feature strings highlighting book benefits
    features: [{
        // Each feature must be a string
        // Example features: "Full color", "Practice questions", etc.
        type: String
    }],

    // Discount percentage field for promotional pricing
    discount: {
        // Field must be a number data type
        type: Number,

        // Default to 0 meaning no discount applied
        default: 0,

        // Minimum discount is 0 percent
        min: 0,

        // Maximum discount is 100 percent (free)
        max: 100
    },

    // Stock availability flag for inventory management
    inStock: {
        // Field must be a boolean value (true or false)
        type: Boolean,

        // Default to true meaning book is available for purchase
        default: true
    }
}, {
    // Schema options: enable automatic timestamp management
    // Mongoose will automatically add createdAt and updatedAt fields
    timestamps: true
});

// Create compound index on grade and category for optimized filtering
// Students often filter books by their grade level and subject category
// The '1' indicates ascending order for both fields
bookSchema.index({ grade: 1, category: 1 });

// Create text index on title and author fields for full-text search
// Enables efficient searching of books by name or author
bookSchema.index({ title: 'text', author: 'text' });

// Create and export Book model based on the defined schema
const Book = mongoose.model('Book', bookSchema);

// Export Book model as default export
export default Book;
