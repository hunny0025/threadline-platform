// ============================================================
// Threadline Platform - MongoDB Connection (Mongoose)
// This file handles the connection to MongoDB using Mongoose.
// It exports a connect function that should be called once
// during server startup (in server.js).
// Requires MONGODB_URI to be set in the environment variables.
// ============================================================

const mongoose = require('mongoose');
const { mongodbUri } = require('../config');

const connectDB = async () => {
  try {
    await mongoose.connect(mongodbUri);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
