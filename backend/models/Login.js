/**
 * models/Login.js
 * Mongoose schema for the "logins" collection.
 *
 * Fields:
 *   - name      : submitted full name
 *   - email     : submitted demo email
 *   - password  : submitted demo password
 *   - timestamp : when the record was created (auto)
 */

const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: [100, 'Name is too long'],
      default: ''
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      maxlength: [254, 'Email is too long']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      maxlength: [128, 'Password is too long']
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: 'logins',
    versionKey: false
  }
);

loginSchema.index({ timestamp: -1 });

module.exports = mongoose.model('Login', loginSchema);
