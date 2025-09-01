// MongoDB initialization script
// This script creates the application database and a default admin user

// Switch to the application database
db = db.getSiblingDB('web_toz_db');

// Create a collection (this will create the database if it doesn't exist)
db.createCollection('users');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "createdAt": -1 });

// Create default admin user (optional)
db.users.insertOne({
  name: "Admin User",
  email: "admin@tozsolutions.com",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj7.6xY3R4ES", // password: admin123
  role: "admin",
  isEmailVerified: true,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

print('Database initialized successfully');
print('Default admin user created: admin@tozsolutions.com / admin123');