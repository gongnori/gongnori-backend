const express = require("express");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
require("dotenv").config();

router.post("/location", async (req, res, next) => {
  try {
    const { email, locations } = req.body;
    await User.findOneAndUpdate({ email }, { locations });

    res.status(200).json({
      message: "success",
      data: null,
      error: null,
    });
  } catch (err) {
    res.status(200).json({
      message: "fail",
      data: null,
      error: "error",
    });

    console.log(`POST : /auth/location - ${err.message}`);
    next(createError(500, "Internal Server Error"));
  }
});

router.get("/team", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const { email } = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    const user = await User.findOne({ email }).populate("teams", "_id name");

    const teams = user.teams.map((team) => {
      const id = team._id;
      const name = team.name;

      return { id, name };
    });

    res.status(200).json({
      message: "success",
      data: teams,
      error: null,
    });
  } catch (err) {
    res.status(200).json({
      message: "fail",
      data: null,
      error: "error",
    });

    console.log(`GET : /user/team - ${err}`);
    next(createError(500, "Internal Server Error"));
  }
});

router.get("/message", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const { email } = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    const user = await User.findOne({ email });

    const data = user.messages;
    console.log(data);

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

    console.log(`GET : /user/message - ${err}`);
    next(createError(500, "Internal Server Error"));
  }
});

module.exports = router;
