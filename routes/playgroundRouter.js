const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const Playground = require("../models/Playground");
require("dotenv").config();

router.get("/", async (req, res, next) => {
  try {
    const { province, city, district } = req.query;

    const playgrounds = await Playground.find({
      "address.province": province,
      "address.city": city,
      "address.district": district,
    });

    res.status(200).json({
      message: "success",
      data: playgrounds,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      message: "fail",
      data: null,
      error: "error",
    });

    console.error(`GET : /playground/query - ${err.messsage}`);
    next(createError(500, "Internal Server Error"));
  }
});

module.exports = router;
