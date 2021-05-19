const express = require("express");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { saveMyLocations } = require("../models/controllers/userController");

require("dotenv").config();

router.post("/location", async (req, res, next) => {
  try {
    const { locations } = req.body;
    const token = req.headers.authorization;
    const { email } = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

    await saveMyLocations(email, locations);

    res.status(200).json({
      message: "success",
      data: null,
      error: null,
    });
  } catch (err) {
    console.log(`POST : /auth/location - ${err.message}`);
    next(createError(500, "Internal Server Error"));
  }
});

module.exports = router;
