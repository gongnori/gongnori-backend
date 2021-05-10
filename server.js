const cors = require("cors");
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const indexRouter = require("./routes/indexRouter");
const authRouter = require("./routes/authRouter");
const matchRouter = require("./routes/matchRouter");
const playgroundRouter = require("./routes/playgroundRouter");

const app = express();
const port = process.env.PORT || 8000;
const server = http.createServer(app);

server.listen(port, () => console.log(`server connection: port ${port}`));

const db = mongoose.connection;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

db.once("open", () => console.log("MongoDB Connection Success! :)"));
db.on("error", () => console.log("MongoDB Connection Error :("));

const makeMockDB = require("./utils/makeMockDB");
if (true) {
  makeMockDB();
}

// app.use(cors({ origin: true, credentials: true }));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/match", matchRouter);
app.use("/playground", playgroundRouter);

app.use((err, req, res, next) => {
  if (err.status === 404) { res.status(200).end() }
});

module.exports = server;
