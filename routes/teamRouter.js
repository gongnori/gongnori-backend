const express = require("express");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");

const uploadImage = require("../middleware/uploadImage");

const Team = require("../models/Team");
const {
  createTeam,
  getTeams,
  registerUser,
  updateRank,
} = require("../models/controllers/teamController");
const { getMyTeams } = require("../models/controllers/userController");

require("dotenv").config();

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const input = req.query;

    const teams = await getTeams(input);

    res.status(200).json({
      message: "success",
      data: teams,
      error: null,
    });
  } catch (err) {
    console.log(`GET : /team - ${err}`);
    next(createError(500, "Internal Server Error"));
  }
});

router.get("/my", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const { email } = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

    const teams = await getMyTeams(email);

    res.status(200).json({
      message: "success",
      data: teams,
      error: null,
    });
  } catch (err) {
    console.log(`GET : /team/my - ${err}`);
    next(createError(500, "Internal Server Error"));
  }
});

router.post("/", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const { email } = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    const { name } = req.body;

    const team = await Team.findOne({ name });

    if (team) {
      return res.status(200).json({
        message: "team exist",
        data: null,
        error: null,
      });
    }

    await createTeam({ email, ...req.body });

    res.status(200).json({
      message: "success",
      data: null,
      error: null,
    });
  } catch (err) {
    console.log(`POST : /team - ${err}`);
    next(createError(500, "Internal Server Error"));
  }
});

router.post("/emblem", uploadImage.single("image"), (req, res, next) => {
  try {
    const s3Uri = req.file.location;

    res.status(200).json({
      message: "success",
      data: s3Uri,
      error: null,
    });
  } catch (err) {
    console.log(`POST : /team/emblem - ${err.messsage}`);
    next(createError(500, "Internal Server Error"));
  }
});

router.patch("/members", async (req, res, next) => {
  try {
    const input = req.body;
    const user = await registerUser(input);

    if (!user) {
      return res.status(200).json({
        message: "invalid user",
        data: null,
        error: null,
      });
    }

    res.status(200).json({
      message: "success",
      data: null,
      error: null,
    });
  } catch (err) {
    console.log(`PATCH : /team/members - ${err}`);
    next(createError(500, "Internal Server Error"));
  }
});

router.patch("/rank", async (req, res, next) => {
  try {
    const input = req.body;

    await updateRank(input);

    res.status(200).json({
      message: "success",
      data: null,
      error: null,
    });
  } catch (err) {
    console.log(`PATCH : /team/rank - ${err}`);
    next(createError(500, "Internal Server Error"));
  }
});

module.exports = router;
