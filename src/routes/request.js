const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");

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

      const toUser = await User.findById({
        _id: toUserId,
      });
      if (!toUser) {
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
     const data= await connectionRequest.save();
     const mailRes = await sendEmail.run(toUser,loggedInUser)
     console.log(mailRes)
      res.json({
        message: "Connention Request sent",
        data: data,
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      const isStatusAllowed = allowedStatus.includes(status);
      if (!isStatusAllowed) {
        throw new Error("Status not allowed");
      }
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        throw new Error("Request not found");
      }
      console.log(connectionRequest.status);
      connectionRequest.status = "accepted";
      const data = await connectionRequest.save();
      res.json({
        message: `${loggedInUser.firstName} ${status} connection request`,
        data,
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);

module.exports = requestRouter;
