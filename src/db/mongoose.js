const mongoose = require('mongoose');

const MAX_RETRIES = 5;

const connectDB = async (attempt = 1) => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('MONGODB_URI is not defined in environment variables');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, {
      maxPoolSize: 10,        // max connections in pool
      minPoolSize: 2,         // keep at least 2 connections alive
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error(`MongoDB connection failed (attempt ${attempt}/${MAX_RETRIES}):`, error.message);
    if (attempt < MAX_RETRIES) {
      const delay = Math.min(1000 * 2 ** attempt, 30000); // exponential back-off, max 30s
      console.log(`Retrying in ${delay / 1000}s…`);
      await new Promise((res) => setTimeout(res, delay));
      return connectDB(attempt + 1);
    }
    process.exit(1);
  }
};

module.exports = connectDB;
