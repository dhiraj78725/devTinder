const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("gender data is not valid");
        }
      },
    },
    pictureUrl: {
      type: String,
      default:
        "https://t4.ftcdn.net/jpg/08/06/58/03/360_F_806580330_nM9J5dzapvn7hGqEetnMThzp9qZn0HT9.jpg",
    },
    about: {
      type: String,
      default: "This id default description",
    },
    skills: {
      type: [String, String, String],
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  try {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "DEVTINDER@0709", {
      expiresIn: "7d",
    });
    return token;
  } catch (error) {
    throw new Error(error.message);
  }
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  try {
    const user = this;
    const hashPassword = user.password;
    const isPasswordValid = await bcrypt.compare(
      passwordInputByUser,
      hashPassword
    );
    return isPasswordValid;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = mongoose.model("User", userSchema);
