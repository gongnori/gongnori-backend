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

    const user = await User.findOne({ email }).populate("messages");

    const hasMessage = user.messages.some((message) => {
      return message.match.toString() === match.id.toString();
    });
    
    if (hasMessage) {
      return res.status(200).json({
        message: "success",
        data: null,
        error: null,
      });
    }

    const matchTeams = await Match.findById(match.id, "teams")
      .populate("teams", "captin");
    const hostCaptinId = matchTeams.teams[0].captin;

    const message = await Message.create({
      match: match.id,
      participants: [hostCaptinId, user["_id"]],
    });

    const hostCaptin = await User.findById(hostCaptinId);
    hostCaptin.messages.push(message["_id"]);
    await hostCaptin.save();

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

router.get("/my", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const { email } = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    const user = await User.findOne({ email }, "messages")
      .populate({ path: "messages", populate: { path: "match", populate: { path: "sports" } } })
      .populate({ path: "messages", populate: { path: "match", populate: { path: "playground" } } })
      .populate({ path: "messages", populate: { path: "participants", select: "name" } })

    const data = user.messages.map((message) => {
      const { match, participants } = message;

      return {
        id: message["_id"],
        participants: [participants[0].name, participants[1].name],
        sports: match.sports["korean_name"],
        type: match.match_type,
        playtime: {
          start: match.playtime.start,
          end: match.playtime.end,
        },
        playground: {
          name: match.playground.name,
          city: match.playground.address.city,
          district: match.playground.address.district,
        },
      };
    });

    res.status(200).json({
      message: "success",
      data,
      error: null,
    });
  } catch (err) {
    res.status(200).json({
      message: "fail",
      data: null,
      error: "error",
    });

    console.log(`GET : /message/my - ${err}`);
    next(createError(500, "Internal Server Error"));
  }
});

module.exports = router;