import bcrypt from 'bcryptjs';
import { TeacherRequest } from './src/models/index.js';

async function testTeacherRequest() {
  try {
    console.log('Testing teacher request creation...');
    
    const hashedPassword = await bcrypt.hash('test123', 10);
    const request = await TeacherRequest.create({
      name: 'Test Teacher',
      email: 'teacher@test.com',
      password: hashedPassword,
    });
    
    console.log('Teacher request created:', request.toJSON());
    
    // Test fetching
    const requests = await TeacherRequest.findAll();
    console.log('All requests:', requests.map(r => r.toJSON()));
    
  } catch (error) {
    console.error('Test failed:', error);
  }
  process.exit();
}

testTeacherRequest();
