const express = require("express");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/User");
require("dotenv").config();

router.post("/login", async (req, res, next) => {
  try {
    const { name, email, id } = req.body.userInfo;
    const user = await User.findOne({ uid: id });

    if (!user) {
      await User.create({ uid: id, name, email });
    }

    const token = jwt.sign(
      { name, email },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: 12 * 60 * 60 },
    );

    res.status(200).json({
      message: "success",
      data: token,
      error: null,
    });
  } catch (err) {
    res.status(200).json({
      message: "fail",
      data: null,
      error: "error",
    });

    console.error(`POST : /auth/login - ${err.messsage}`);
    next(createError(500, "Internal Server Error"));
  }
});

module.exports = router;
