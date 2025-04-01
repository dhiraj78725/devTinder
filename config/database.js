const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://dhiraj78725:dhiraj123@nodedev.sqcquml.mongodb.net/devTinder"
  );
};

module.exports = connectDB

