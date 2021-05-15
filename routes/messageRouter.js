const express = require("express");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Match = require("../models/Match");
const Sports = require("../models/Sports");
const Message = require("../models/Message");
const User = require("../models/User");
require("dotenv").config();

router.post("/", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const { email } = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    const match = req.body;
    const message = await Message.create({
    });

    const matchTeams = await Match.findById(match.id, "teams")
      .populate("teams", "captin");
    const hostCaptinId = matchTeams.teams[0].captin;

    const hostCaptin = await User.findById(hostCaptinId);
    hostCaptin.messages.push(message["_id"]);
    await hostCaptin.save();

    const user = await User.findOne({ email });
    user.messages.push(message["_id"]);
    await user.save();

    res.status(200).json({
      message: "success",
      data: null,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      message: "fail",
      data: null,
      error: "error",
    });

    console.log(`POST : /message - ${err}`);
    next(createError(500, "Internal Server Error"));
  }
});

module.exports = router;
