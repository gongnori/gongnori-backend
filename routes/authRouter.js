const express = require("express");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
const { getMyLocations, getMyTeams } = require("../models/controllers/userController");
const { getAppSports } = require("../models/controllers/sportsController");
const { getMyMessages } = require("../models/controllers/messageController");

router.post("/login", async (req, res, next) => {
  try {
    const { name, email } = req.body;
    let user = await User.findOne({ email })
      .populate("locations");

    if (!user) {
      user = await User.create({ name, email });
    }

    const locations = await getMyLocations(email);
    const sports = await getAppSports();
    const teams = await getMyTeams(email);
    const messages = await getMyMessages(email);

    const token = jwt.sign(
      { name, email },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: 12 * 60 * 60 },
    );

    res.status(200).json({
      message: "success",
      data: { token, locations, teams, sports, messages },
      error: null,
    });
  } catch (err) {
    console.log(`POST : /auth/login - ${err.message}`);
    next(createError(500, "Internal Server Error"));
  }
});

module.exports = router;
