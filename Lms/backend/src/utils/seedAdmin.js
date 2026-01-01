// Import bcrypt library for secure password hashing using salt and hash algorithm
import bcrypt from 'bcryptjs';

// Import User model to interact with users collection in MongoDB
import { User } from '../models/index.js';

// Export async function to create default admin user for application management
export async function seedAdmin() {
  // Wrap in try-catch to handle potential database errors gracefully
  try {
    // Query database to check if an admin user already exists
    // This prevents duplicate admin accounts and maintains data integrity
    const existingAdmin = await User.findOne({ email: 'admin@lms.com' });

    // If admin account found, skip creation to avoid duplicates
    if (existingAdmin) {
      // Log message and exit function early without creating new admin
      console.log('Admin user already exists');
      return;
    }

    // Hash the default password using bcrypt with salt rounds of 10
    // Salting adds random data to password before hashing for enhanced security
    // Higher salt rounds increase security but require more processing time
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create new admin user document in the database
    await User.create({
      // Set full name for the administrator account
      name: 'System Administrator',

      // Set email as unique identifier for login
      email: 'admin@lms.com',

      // Store the hashed password (never store plain text passwords)
      password: hashedPassword,

      // Assign 'admin' role for full system privileges
      role: 'admin',
    });

    // Log success message with login credentials for initial setup
    console.log('Admin user created successfully (admin@lms.com / admin123)');
  } catch (error) {
    // Log any errors that occur during admin creation for debugging
    console.error('Error seeding admin:', error);
  }
}
