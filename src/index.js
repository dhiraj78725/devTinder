const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// app.get("/user", async (req, res) => {
//   try {
//     const userEmail = req.body.email;
//     const user = await User.findOne({ email: userEmail });
//     console.log(user);
//     if (!user) {
//       res.status(404).send("User not found");
//     } else {
//       res.send(user);
//     }
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// });

// app.get("/feed", async (req, res) => {
//   try {
//     const users = await User.find();
//     // console.log(user)
//     if (users.length === 0) {
//       res.status(404).send("Users not found");
//     } else {
//       res.send(users);
//     }
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// });

// app.patch("/user/:userId", async (req, res) => {
//   const userId = req.params.userId;
//   const data = req.body;
//   try {
//     const ALLOWED_UPDATES = ["pictureUrl", "about", "skills", "password"];
//     const isUpdateAllowed = Object.keys(data).every((elem) =>
//       ALLOWED_UPDATES.includes(elem)
//     );
//     if (!isUpdateAllowed) {
//       throw new Error("Update Not Allowed");
//     }
//     const user = await User.findByIdAndUpdate({ _id: userId }, data, {
//       returnDocument: "after",
//       runValidators: true,
//     });
//     console.log(user);
//     res.send("User Updated");
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// });

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
