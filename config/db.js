const mongoose = require("mongoose");

const connectDB = async () => {
  // If readyState is 1, verify the connection is actually alive with a ping
  if (mongoose.connection.readyState === 1) {
    try {
      await mongoose.connection.db.admin().ping();
      console.log("Using existing MongoDB connection (verified alive)");
      return;
    } catch (err) {
      console.log("Existing connection is dead, reconnecting...");
      // Connection is dead, fall through to reconnect
    }
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not defined. Please set it in your Vercel environment variables.");
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false, // Disable buffering to prevent timeout errors
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Listen for connection drops
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB connection disconnected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err.message);
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB connection reconnected');
    });

  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    throw err;
  }
};

module.exports = connectDB;
