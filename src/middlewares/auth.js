const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error("Invalid Token");
    }

    const decodedMessage = await jwt.verify(token, "DEVTINDER@0709");
    const { _id } = decodedMessage;
    const user = await User.findById(_id);
    // console.log(user);
    if (!user) {
      throw new Error("User Not Found");
    }
    req.user = user; 
    next();
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = { userAuth };
