const express = require("express");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
require("dotenv").config();

router.post("/login", async (req, res, next) => {
  try {
    const { name, email } = req.body;
    let user = await User.findOne({ email }).populate("teams", "_id name").populate("locations");

    if (!user) {
      user = await User.create({ name, email });
    }
    const { locations, teams } = user;

    const token = jwt.sign(
      { name, email },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: 12 * 60 * 60 },
    );

    res.status(200).json({
      message: "success",
      data: { token, locations, teams },
      error: null,
    });
  } catch (err) {
    res.status(200).json({
      message: "fail",
      data: null,
      error: "error",
    });

    console.log(`POST : /auth/login - ${err.message}`);
    next(createError(500, "Internal Server Error"));
  }
});

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

module.exports = router;
