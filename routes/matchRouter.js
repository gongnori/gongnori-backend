const express = require("express");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Match = require("../models/Match");
const Sports = require("../models/Sports");
const Team = require("../models/Team");
const Playground = require("../models/Playground");
const { createMatch } = require("../models/controllers/matchController");
const User = require("../models/User");
require("dotenv").config();

router.get("/", async (req, res, next) => {
  try {
    const { location, sports, year, month, date } = req.query;

    const thresMin = new Date(year, (parseInt(month, 10) - 1).toString(), date);
    const thresMax = new Date(year, (parseInt(month, 10) - 1).toString(), (parseInt(date, 10) + 1));

    const sportsOid = await Sports.find({ sports }, "_id");

    const matches = await Match.find({ //지역에 따라 query하는 법 찾아보자...
      sports: sportsOid,
      "playtime.start": { $gte: thresMin, $lte: thresMax },
    }).populate("playground")
      .populate({
        path: "teams",
        populate: { path: "location" },
      })
      .populate({
        path: "teams",
        populate: { path: "members", select: "name" },
      })
      .populate({
        path: "teams",
        populate: { path: "captin", select: "name" },
      });

    const data = matches.map((match) => {
      const { address, position } = match.playground;
      const host = match.teams[0];

      return {
        id: match["_id"],
        sports,
        type: match.match_type,
        host: {
          name: host.name,
          captin: host.captin.name,
          province: host.location.province,
          city: host.location.city,
          district: host.location.district,
          emblem: host.emblem,
          members: host.members,
          manner: host.repute.manner,
          ability: host.repute.ability,
        },
        playtime: {
          start: match.playtime.start,
          end: match.playtime.end,
        },
        playground: {
          name: match.playground.name,
          province: address.province,
          city: address.city,
          district: address.district,
          town: address.town,
          detail: address.detail,
          latitude: position.latitude,
          longitude: position.longitude,
        },
      };
    });

    res.status(200).json({
      message: "success",
      data,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      message: "fail",
      data: null,
      error: "error",
    });

    console.log(`GET : /match/query - ${err}`);
    next(createError(500, "Internal Server Error"));
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { sports, month, date, start, end, playground, type, team } = req.body;

    await createMatch(sports, month, date, start, end, playground, type, team);

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

    console.log(`POST : /match - ${err}`);
    next(createError(500, "Internal Server Error"));
  }
});

router.patch("/", async (req, res, next) => {
  console.log(req.body)


  try {
    // const { sports, month, date, start, end, playground, type, team } = req.body;

    const { matchId, host, guest } = req.body

    const guestTeam = await Team.findOne({ name: guest.team });
    const guestTeamOid = guestTeam["_id"];

    const match = await Match.findById(matchId);
    match.teams.push(guestTeamOid);
    await match.save();

    guestTeam.matches.push(matchId);
    await guestTeam.save();


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

    console.log(`POST : /match - ${err}`);
    next(createError(500, "Internal Server Error"));
  }
});

module.exports = router;
