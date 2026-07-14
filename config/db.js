const mongoose = require("mongoose");

const connectDB = async () => {
  console.log("connectDB called");

  console.log("Mongo URI exists:", !!process.env.MONGODB_URI);

  console.log("Connection state:", mongoose.connection.readyState);

  if (mongoose.connection.readyState === 1) {
    console.log("Already connected");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected:", conn.connection.host);

  } catch (err) {
    console.error("Mongo error:", err);
    throw err;
  }
};

module.exports = connectDB;