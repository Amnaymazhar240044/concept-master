import { sequelize } from './src/config/db.js';
import { Role, User, TeacherRequest } from './src/models/index.js';

async function syncDatabase() {
  try {
    console.log('Syncing database...');
    
    // Sync all models
    await sequelize.sync({ alter: true });
    
    console.log('Database synced successfully!');
    
    // Test teacher request creation
    const testRequest = await TeacherRequest.create({
      name: 'Test Teacher',
      email: 'teacher@test.com',
      password: '$2a$10$C3V3puklkHxr5AeJHO3qGerWdMi8.0MVZnoBpiJKZq.p6XpDLZ0R2',
    });
    
    console.log('Test teacher request created:', testRequest.toJSON());
    
    // Fetch all requests
    const requests = await TeacherRequest.findAll();
    console.log('All teacher requests:', requests.length);
    
  } catch (error) {
    console.error('Sync failed:', error);
  }
  process.exit();
}

syncDatabase();
