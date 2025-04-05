const express = require("express");
const bcrypt = require("bcrypt");
const profileRouter = express.Router();
const { validateEditProfileData } = require("../utils/validation");

const { userAuth } = require("../middlewares/auth");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const isEditAllowed = validateEditProfileData(req);
    if (!isEditAllowed) {
      throw new Error("Edit not allowed");
    } else {
      Object.keys(req.body).forEach((key) => {
        loggedInUser[key] = req.body[key];
      });
      await loggedInUser.save();
      res.json({
        message: "User Data Updated Successfully",
        data: loggedInUser,
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { newPassword } = req.body;
    const hashPassword = await bcrypt.hash(newPassword, 10);
    loggedInUser["password"] = hashPassword;
    await loggedInUser.save();
    res.send("Password Updated");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = profileRouter;
