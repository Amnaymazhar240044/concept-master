// Central export file for all Mongoose models
// This file provides a single import point for accessing all database models
// Usage: import { User, Quiz, Class } from './models/index.js';

// Export User model for authentication and user management
export { User } from './User.js';

// Export Role model for role-based access control (legacy)
export { Role } from './Role.js';

// Export Subject model for academic subjects (Math, Physics, etc.)
export { Subject } from './Subject.js';

// Export Class model for academic grade levels (9-12)
export { Class } from './Class.js';

// Export ActivityLog model for tracking user actions and events
export { ActivityLog } from './ActivityLog.js';

// Export Note model for study material PDF management
export { Note } from './Note.js';

// Export Notification model for user announcements and alerts
export { Notification } from './Notification.js';

// Export Lecture model for video lecture content management
export { Lecture } from './Lecture.js';

// Export Quiz model for quiz/assessment management
export { Quiz } from './Quiz.js';

// Export Question model for individual quiz questions
export { Question } from './Question.js';

// Export QuizAttempt model for tracking student quiz submissions
export { QuizAttempt } from './QuizAttempt.js';

// Export QuizResult model for storing individual question results
export { QuizResult } from './QuizResult.js';
