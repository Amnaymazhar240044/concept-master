// Import the mongoose library for MongoDB object modeling and database operations
import mongoose from 'mongoose';

// Export an asynchronous function to establish connection with MongoDB database
export const connectDB = async () => {
  // Use try-catch block to handle potential connection errors gracefully
  try {
    // Attempt to connect to MongoDB using connection string from environment variable
    // If MONGO_URI is not defined in .env, fallback to local MongoDB instance
    // The connection string points to 'concept-master-lms' database
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/concept-master-lms');

    // Log successful connection message with the host address to the console
    // This helps developers confirm database connectivity during server startup
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, log the error message to console for debugging
    console.error(`Error: ${error.message}`);

    // Exit the Node.js process with failure code 1
    // This prevents the application from running without database connection
    process.exit(1);
  }
};
