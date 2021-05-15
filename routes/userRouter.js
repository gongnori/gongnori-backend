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

module.exports = router;
