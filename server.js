const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");
const socketIo = require("socket.io");

const authenticate = require("./middleware/authenticate");

const indexRouter = require("./routes/indexRouter");
const authRouter = require("./routes/authRouter");
const applicationRouter = require("./routes/applicationRouter");
const matchRouter = require("./routes/matchRouter");
const messageRouter = require("./routes/messageRouter");
const teamRouter = require("./routes/teamRouter");
const userRouter = require("./routes/userRouter");

const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = process.env.PORT || 8000;

require("dotenv").config({ path: path.join(__dirname, ".env") });

io.on("connection", (socket) => {
  socket.on("join-chat-room", async (messageId) => {
    socket.join(messageId);
    const message = await Message.findById(messageId);
    socket.emit("load-message", message.chats);

    socket.on("send-message", async (data) => {
      const _message = await Message.findById(messageId);
      _message.chats.push(data);
      await _message.save();

      io.in(messageId).emit("send-message", _message.chats);
    });
  });

  socket.on("leave-chat-room", async (messageId) => {
    socket.leave(messageId);
  });
});

const db = mongoose.connection;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const makeMockDB = require("./utils/makeMockDB");

if (process.env.IS_DATABASE_INITIALIZATION === "true") {
  makeMockDB(process.env.IS_DATABASE_MOCK === "true");
}

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/application", applicationRouter);
app.use("/auth", authRouter);

app.use(authenticate);

app.use("/match", matchRouter);
app.use("/message", messageRouter);
app.use("/user", userRouter);
app.use("/team", teamRouter);

app.use((err, req, res, next) => {
  res.status = err.status || 500;

  res.send({
    message: "server error",
    data: null,
    error: "error",
  });
});

server.listen(port, () => console.log(`server connection: port ${port}`));

db.once("open", () => console.log("MongoDB Connection Success! :)"));
db.on("error", () => console.log("MongoDB Connection Error :("));

module.exports = server;
