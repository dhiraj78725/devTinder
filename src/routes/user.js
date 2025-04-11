const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "age",
      "about",
      "skills",
      "pictureUrl",
    ]);

    const data = connectionRequests.map((row) => {
      return { _id: row._id, fromUserId: row.fromUserId };
    });
    res.json({ message: "", data: data });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser._id,
          status: "accepted",
        },
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "age",
        "about",
        "skills",
        "pictureUrl",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "age",
        "about",
        "skills",
        "pictureUrl",
      ]);

    const data = connectionRequests.map((row) => {
      if (row.toUserId._id.equals(loggedInUser._id)) {
        return row.fromUserId;
      }
      return row.toUserId;
    });
    res.json({ data });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    let page = req.query.page || 1;
    let limit = req.query.limit || 10;
    limit = limit > 3 ? 3 : limit;
    let skip = (page - 1) * limit;
    // console.log(page)
    const userConnections = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    userConnections.forEach((connection) => {
      hideUsersFromFeed.add(connection.fromUserId.toString());
      hideUsersFromFeed.add(connection.toUserId.toString());
    });
    // console.log(hideUsersFromFeed);
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select("firstName lastName age skills about pictureUrl")
      .skip(skip)
      .limit(limit);
    res.json({ data: users });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = userRouter;
