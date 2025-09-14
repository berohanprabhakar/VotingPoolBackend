const express = require("express");
const dotenv = require("dotenv");
const { connectDb } = require("./dbconfig/prisma");
const userRouter = require("./routes/userRoute");
const pollRouter = require("./routes/pollRoute");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.use("/user", userRouter);
app.use("/poll", pollRouter);

app.use("/", (req, res) => {
  return res.json("hellow my fan");
});
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
  });
});
