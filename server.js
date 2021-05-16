const cors = require("cors");
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");
const socketIo = require("socket.io");
const Message = require("./models/Message");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const indexRouter = require("./routes/indexRouter");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const matchRouter = require("./routes/matchRouter");
// const playgroundRouter = require("./routes/playgroundRouter");
const teamRouter = require("./routes/teamRouter");
const applicationRouter = require("./routes/applicationRouter");
const messageRouter = require("./routes/messageRouter");

const app = express();
const port = process.env.PORT || 8000;
const server = http.createServer(app);

const io = socketIo(server);

io.on("connection", (socket) => {
  socket.on("join-chat-room", async (messageId) => {
    socket.join(messageId);
    const message = await Message.findById(messageId);
    socket.emit("load-message", message.chats);

    socket.on("send-message", async (data) => {
      const message = await Message.findById(messageId);
      message.chats.push(data);
      await message.save();

      io.in(messageId).emit("send-message", message.chats);
    });
  });

  socket.on("leave-chat-room", async (messageId) => {
    socket.leave(messageId);
  });
});

server.listen(port, () => console.log(`server connection: port ${port}`));

const db = mongoose.connection;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

db.once("open", () => console.log("MongoDB Connection Success! :)"));
db.on("error", () => console.log("MongoDB Connection Error :("));

const makeMockDB = require("./utils/makeMockDB");
if (false) {
  makeMockDB(true);
}

// app.use(cors({ origin: true, credentials: true }));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/application", applicationRouter);
app.use("/user", userRouter);
app.use("/match", matchRouter);
// app.use("/playground", playgroundRouter);
app.use("/team", teamRouter);
app.use("/message", messageRouter);

app.use((err, req, res, next) => {
  if (err.status === 404) { res.status(200).end() }
});

module.exports = server;
