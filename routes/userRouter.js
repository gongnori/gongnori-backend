const express = require("express");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { saveMyLocations } = require("../models/controllers/userController");

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
    console.log(`POST : /user/location - ${err.message}`);
    next(createError(500, "Internal Server Error"));
  }
});

module.exports = router;
