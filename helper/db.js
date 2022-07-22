const url = process.env.MONGO_URI
const mongoose = require("mongoose");

module.exports = async () => {
  try {
    await mongoose.connect(url, () => {
      console.log("MongoDB connected successfully");
    });
  } catch (error) {
    console.log(error);
  }
};