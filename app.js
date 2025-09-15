const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const { connectDb } = require("./dbconfig/prisma");

const userRouter = require("./routes/userRoute");
const pollRouter = require("./routes/pollRoute");
const voteRouter = require("./routes/voteRoute");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.set("io", io);

app.use("/user", userRouter);
app.use("/poll", pollRouter);
app.use("/vote", voteRouter);

app.use("/", (req, res) => {
  return res.json("hellow my fan");
});

io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  socket.on("joinPoll", (pollId) => {
    socket.join(`poll-${pollId}`);
    console.log(`Client ${socket.id} joined room poll-${pollId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
  });
});
