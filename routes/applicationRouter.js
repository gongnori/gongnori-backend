const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const Location = require("../models/Location");
const Sports = require("../models/Sports");
// const Message = require("../models/Message");

require("dotenv").config();

router.get("/", async (req, res, next) => {
  try {
    const locations = await Location.find();
    const sports = await Sports.find();

    res.status(200).json({
      message: "success",
      data: { locations, sports},
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      message: "fail",
      data: null,
      error: "error",
    });

    console.error(`GET : /application - ${err.messsage}`);
    next(createError(500, "Internal Server Error"));
  }
});

module.exports = router;
