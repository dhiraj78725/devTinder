const express = require("express");
const connectDB = require("../config/database");
const User = require("../models/user");
const app = express();

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Dhiraj",
    lastName: "Bhardwaj",
    email: "dhiraj78725@gmail.com",
    password: "123456",
  });
  try {
    await user.save();
    res.send("User created");
  } catch (error) {
    res.status(400).send("Error creating user", error.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(3000, () => {
      console.log("server started");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected", err);
  });
