// Import Class model to interact with classes collection in MongoDB
import { Class } from '../models/index.js';

// Export async function to seed initial class data for academic levels
export async function seedClasses() {
  // Wrap in try-catch block to handle potential database errors
  try {
    // Query database to check if any class records already exist
    // This prevents duplicate seeding on subsequent runs
    const existingClasses = await Class.find();

    // If classes already exist in database, skip seeding process
    if (existingClasses.length > 0) {
      // Log informational message and exit function early
      console.log('Classes already exist');
      return;
    }

    // Define array of class objects to be inserted into database
    // Application focuses on secondary education (grades 9-12)
    const classes = [
      // Commented out classes 1-8 as they're not currently needed
      // These can be uncommented if application scope expands to primary education
      // { title: 'Class 1' },
      // { title: 'Class 2' },
      // { title: 'Class 3' },
      // { title: 'Class 4' },
      // { title: 'Class 5' },
      // { title: 'Class 6' },
      // { title: 'Class 7' },
      // { title: 'Class 8' },

      // Create class record for 9th grade
      { title: 'Class 9' },

      // Create class record for 10th grade (usually Matriculation level)
      { title: 'Class 10' },

      // Create class record for 11th grade (Intermediate/FSc level)
      { title: 'Class 11' },

      // Create class record for 12th grade (completion of secondary education)
      { title: 'Class 12' }
    ];

    // Insert all class records into database in a single batch operation
    // insertMany is more efficient than individual inserts for multiple documents
    await Class.insertMany(classes);

    // Log success message confirming class creation
    console.log('classes created successfully');
  } catch (error) {
    // Log any errors encountered during class seeding for debugging
    console.error('Error seeding classes:', error);
  }
}
