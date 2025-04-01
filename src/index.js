const express = require("express");
const app = express();

// app.use("/", (req, res) => {
//   res.end("Hello Devtinder");
// });

app.use("/test", (req, res) => {
  res.send("Hello Devtinder Test");
});

app.listen(3000, () => {
  console.log("server started");
});
