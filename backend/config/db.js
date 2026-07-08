const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("mongoDB connected successfully");
  } catch (error) {
    console.error("mongoDB connection error:", error.message);
    console.log("Attempting to connect to local MongoDB database fallback...");
    try {
      await mongoose.connect("mongodb://127.0.0.1:27017/cricket-news-app");
      console.log("Connected to local MongoDB fallback successfully");
    } catch (localErr) {
      console.error("Local MongoDB fallback also failed. Continuing offline.");
    }
  }
};

module.exports = connectDB;