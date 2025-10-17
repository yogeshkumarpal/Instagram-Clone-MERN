const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const mongoURI = process.env.MongoDBURI;
const connectDB = async () => {
  try {
    let res = await mongoose.connect(mongoURI);
    if (res) {
      console.log("MongoDB connected");
    }
  } catch (error) {
    console.log("error in connecting DB", error);
  }
};

module.exports = connectDB;
