/**
 * routes/logins.js
 * API routes for the awareness demo login collection.
 *
 * POST   /login          – store a new demo credential
 * GET    /entries        – list all entries (newest first)
 * DELETE /entries/:id    – delete one entry by MongoDB _id
 * DELETE /entries        – delete all entries
 */

const express = require('express');
const router = express.Router();
const Login = require('../models/Login');

/**
 * POST /login
 * Body: { name, email, password }
 * Stores the submitted demo credentials and returns success JSON.
 */
router.post('/login', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required.'
      });
    }

    if (!password || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Password is required.'
      });
    }

    // Create and save the document
    const entry = await Login.create({
      name: typeof name === 'string' ? name.trim() : '',
      email: email.trim(),
      password: password
    });

    return res.status(201).json({
      success: true,
      message: 'Demo credentials stored successfully.',
      id: entry._id
    });
  } catch (err) {
    console.error('POST /login error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while storing credentials.'
    });
  }
});

/**
 * GET /entries
 * Returns all documents sorted by newest first.
 */
router.get('/entries', async (req, res) => {
  try {
    const entries = await Login.find()
      .sort({ timestamp: -1 })
      .lean(); // plain JS objects for faster response

    return res.status(200).json({
      success: true,
      count: entries.length,
      data: entries
    });
  } catch (err) {
    console.error('GET /entries error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching entries.'
    });
  }
});

/**
 * DELETE /entries/:id
 * Deletes a single document by its MongoDB ObjectId.
 */
router.delete('/entries/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid entry ID.'
      });
    }

    const deleted = await Login.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Entry not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Entry deleted successfully.'
    });
  } catch (err) {
    console.error('DELETE /entries/:id error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting entry.'
    });
  }
});

/**
 * DELETE /entries
 * Deletes ALL documents in the collection.
 */
router.delete('/entries', async (req, res) => {
  try {
    const result = await Login.deleteMany({});

    return res.status(200).json({
      success: true,
      message: 'All entries deleted successfully.',
      deletedCount: result.deletedCount
    });
  } catch (err) {
    console.error('DELETE /entries error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting all entries.'
    });
  }
});

module.exports = router;
