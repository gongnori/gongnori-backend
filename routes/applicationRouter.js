const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const { getAppLocations } = require("../models/controllers/locationController");
const { getAppSports } = require("../models/controllers/sportsController");
const { getAppPlaygrounds } = require("../models/controllers/playgroundController");

require("dotenv").config();

router.get("/", async (req, res, next) => {
  try {
    const locations = await getAppLocations();
    const sports = await getAppSports();
    const playgrounds = await getAppPlaygrounds();

    res.status(200).json({
      message: "success",
      data: { locations, sports, playgrounds },
      error: null,
    });
  } catch (err) {
    console.error(`GET : /application - ${err}`);
    next(createError(500, "Internal Server Error"));
  }
});

module.exports = router;
