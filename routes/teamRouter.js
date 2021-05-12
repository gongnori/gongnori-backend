const express = require("express");
const createError = require("http-errors");
const router = express.Router();

const Team = require("../models/Team");

require("dotenv").config();

router.get("/my-team/:myTeamId", async (req, res, next) => {
  try {
    const { myTeamId } = req.params;
    const team = await Team.findById({_id: myTeamId })
      .populate("captin", "name email")
      .populate("members", "name email")
      .populate({ path: "matches", populate: { path: "teams", select: "name"}})
      .populate({ path: "matches", populate: { path: "playground", select: "name address" }});
      // .populate("matches");
console.log(team)
    res.status(200).json({
      message: "success",
      data: team,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      message: "fail",
      data: null,
      error: "error",
    });

    console.error(`GET : /team/my-team/:myTeamId - ${err.messsage}`);
    next(createError(500, "Internal Server Error"));
  }
});

router.post("/", async (req, res, next) => {
  try {
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

    console.error(`GET : /match/query - ${err.messsage}`);
    next(createError(500, "Internal Server Error"));
  }
});

module.exports = router;
