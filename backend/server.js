/**
 * server.js
 * Express entry point for WallZ awareness demo backend.
 * Serves the website + API so friends can sign up from one shared link.
 * Linked to MongoDB Atlas (collection: logins).
 */

const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./db');
const loginsRouter = require('./routes/logins');

const app = express();
const FRONTEND_DIR = path.join(__dirname, 'public');

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Backend is healthy', db: 'MongoDB Atlas' });
});

// Login / admin API routes (POST /login, GET /entries, DELETE /entries...)
app.use('/', loginsRouter);

// Serve the WallZ website
app.use(express.static(FRONTEND_DIR));

// SPA-style fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

const PORT = process.env.PORT || 3000;

async function start() {
  await connectDB();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
    console.log(`📁 Website: http://localhost:${PORT}`);
    console.log(`🗄️  Database: MongoDB Atlas (awareness_demo / logins)`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
