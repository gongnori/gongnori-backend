const express = require("express");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const router = express.Router();

const {
  createMatch,
  createRankMatch,
  fixMatch,
  getMatches,
} = require("../models/controllers/matchController");

router.get("/", async (req, res, next) => {
  try {
    const input = req.query;

    const matches = await getMatches(input);

    res.status(200).json({
      message: "success",
      data: matches,
      error: null,
    });
  } catch (err) {
    console.log(`GET : /match/query - ${err}`);
    next(createError(500, "Internal Server Error"));
  }
});

router.post("/", async (req, res, next) => {
  try {
    const input = req.body;

    await createMatch(input);

    res.status(200).json({
      message: "success",
      data: null,
      error: null,
    });
  } catch (err) {
    console.log(`POST : /match - ${err}`);
    next(createError(500, "Internal Server Error"));
  }
});

router.post("/rank", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const { email } = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

    const input = { email, ...req.body };

    await createRankMatch(input);

    res.status(200).json({
      message: "success",
      data: null,
      error: null,
    });
  } catch (err) {
    console.log(`POST : /match/rank - ${err}`);
    next(createError(500, "Internal Server Error"));
  }
});

router.patch("/", async (req, res, next) => {
  try {
    const input = req.body;

    await fixMatch(input);

    res.status(200).json({
      message: "success",
      data: null,
      error: null,
    });
  } catch (err) {
    console.log(`PATCH : /match - ${err}`);
    next(createError(500, "Internal Server Error"));
  }
});

module.exports = router;
