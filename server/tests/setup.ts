import { connectDatabase, disconnectDatabase } from '../src/config/database';

// Setup test environment
beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/web_toz_test';
  
  try {
    await connectDatabase();
  } catch (error) {
    console.error('Test database connection failed:', error);
  }
});

// Cleanup after tests
afterAll(async () => {
  try {
    await disconnectDatabase();
  } catch (error) {
    console.error('Test database disconnection failed:', error);
  }
});