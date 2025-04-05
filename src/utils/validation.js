const validator = require("validator");

const validateSignUpData = (req) => {
  // console.log(req)
  if (!validator.isStrongPassword(req.body.password)) {
    throw new Error("Please enter a strong password");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = ["pictureUrl", "about", "skills", "password"];
  const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field));
  return isEditAllowed;
};

module.exports = { validateSignUpData, validateEditProfileData };
