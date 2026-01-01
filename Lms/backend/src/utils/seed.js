// Import database connection function to establish MongoDB connection
import { connectDB } from '../config/db.js';

// Import admin user seeding function to create default administrator account
import { seedAdmin } from './seedAdmin.js';

// Import class seeding function to create initial class records (9-12)
import { seedClasses } from './seedClasses.js';

// Main seeding script that initializes the database with essential data
// This script should be run once during initial application setup
async function seed() {
    // Use try-catch to handle any errors during the seeding process
    try {
        // Establish connection to MongoDB database before performing any operations
        await connectDB();

        // Log user-friendly message indicating seeding process has started
        console.log('🌱 Starting database seeding...\n');

        // Create the default admin user account for system administration
        // This ensures there's always an admin account to manage the application
        await seedAdmin();

        // Create initial class records for grades 9 through 12
        // These classes are required for the application's academic structure
        await seedClasses();

        // Log success message confirming all seeding operations completed
        console.log('\n✅ Database seeding completed successfully!');

        // Exit process with success code 0 to indicate successful completion
        process.exit(0);
    } catch (error) {
        // Log error message if seeding fails at any point
        console.error('❌ Error seeding database:', error);

        // Exit process with error code 1 to indicate failure
        // This helps deployment scripts detect seeding failures
        process.exit(1);
    }
}

// Execute the seed function immediately when this script is run
seed();
