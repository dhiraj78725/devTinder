const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const fromUserId = loggedInUser._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const isToUserIdExits = await User.findById({
        _id: toUserId,
      });
      if (!isToUserIdExits) {
        throw new Error("User doesn't exits");
      }
      const allowedStatus = ["interested", "ignored"];
      const isStatusAllowed = allowedStatus.includes(status);
      if (!isStatusAllowed) {
        throw new Error("Status type is invalid");
      }
      const isRequestAlreadySent = await ConnectionRequest.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });
      if (isRequestAlreadySent) {
        throw new Error("Request already sent");
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      await connectionRequest.save();
      res.json({
        message: "Connention Request sent",
        data: connectionRequest,
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);

module.exports = requestRouter;
