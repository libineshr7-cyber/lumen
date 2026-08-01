/**
 * db.js
 * MongoDB Atlas connection using Mongoose.
 * Database name: awareness_demo
 */

const mongoose = require('mongoose');

/**
 * Connect to MongoDB Atlas.
 * Uses MONGODB_URI from environment variables.
 * Exits the process if the connection fails (critical dependency).
 */
async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI is not defined in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB Atlas (database: awareness_demo)');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
}

// Optional: log connection events for debugging
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err.message);
});

module.exports = { connectDB };
