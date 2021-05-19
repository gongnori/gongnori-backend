const aws = require("aws-sdk");
const createError = require("http-errors");
const express = require("express");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const multerS3 = require("multer-s3");

const Team = require("../models/Team");

const { createTeam, getTeams, registerUser } = require("../models/controllers/teamController");
const { getMyTeams } = require("../models/controllers/userController");

require("dotenv").config();

const router = express.Router();

const s3 = new aws.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});

const upload = multer({
  storage: multerS3({
    s3,
    acl: "public-read",
    bucket: "minho-bucket",
    metadata(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key(req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

router.get("/", async (req, res, next) => {
  try {
    const { province, city, district, sports } = req.query;

    const teams = await getTeams(province, city, district, sports);

    res.status(200).json({
      message: "success",
      data: teams,
      error: null,
    });
  } catch (err) {
    res.status(200).json({
      message: "fail",
      data: null,
      error: "error",
    });

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
    res.status(200).json({
      message: "fail",
      data: null,
      error: "error",
    });

    console.log(`GET : /team/my - ${err}`);
    next(createError(500, "Internal Server Error"));
  }
});

router.post("/", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const { email } = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    const { name, location, sports, imageS3 } = req.body;

    const team = await Team.findOne({ name });

    if (team) {
      return res.status(200).json({
        message: "team exist",
        data: null,
        error: null,
      });
    }

    await createTeam(email, name, sports, location, imageS3);

    res.status(200).json({
      message: "success",
      data: null,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      message: "fail",
      data: null,
      error: "error",
    });

    console.log(`POST : /team - ${err}`);
    next(createError(500, "Internal Server Error"));
  }
});

router.post("/emblem", upload.single("image"), (req, res, next) => {
  try {
    const s3Uri = req.file.location;

    res.status(200).json({
      message: "success",
      data: s3Uri,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      message: "fail",
      data: null,
      error: "error",
    });

    console.log(`POST : /team/emblem - ${err.messsage}`);
    next(createError(500, "Internal Server Error"));
  }
});

router.patch("/members", async (req, res, next) => {
  try {
    const { email, teamId } = req.body;
    const user = await registerUser(email, teamId);

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
    res.status(200).json({
      message: "fail",
      data: null,
      error: "error",
    });

    console.log(`PATCH : /team/members - ${err}`);
    next(createError(500, "Internal Server Error"));
  }
});

router.patch("/rank", async (req, res, next) => {
  try {
    const { matchResult, manner, myTeamId, yourTeamId } = req.body;

    const [myTeam, yourTeam] = await Promise.all([
      await Team.findById(myTeamId),
      await Team.findById(yourTeamId),
    ]);

    const myRankDifference = myTeam.rank - yourTeam.rank;
    const yourRankDifference = -myTeam.rank + yourTeam.rank;

    const myExpectedResult = 1 / (1 + 10 ** (-myRankDifference / 600));
    const yourExpectedResult = 1 / (1 + 10 ** (-yourRankDifference / 600));

    let myResult = 0;
    let yourResult = 0;

    if (matchResult === "승리") {
      myResult = 1;
      yourResult = 0;
    } else if (matchResult === "패배") {
      myResult = 0;
      yourResult = 1;
    } else if (matchResult === "무승부") {
      myResult = 0.5;
      yourResult = 0.5;
    }

    const SCORE_FACTOR = 10;
    const myPoint = SCORE_FACTOR * (myResult - Math.round(100 * myExpectedResult) / 100);
    const yourPoint = SCORE_FACTOR * (yourResult - Math.round(100 * yourExpectedResult) / 100);

    await Promise.all([
      await Team.findByIdAndUpdate(myTeamId, {
        rank: myTeam.rank + myPoint,
      }),
      await Team.findByIdAndUpdate(yourTeamId, {
        rank: yourTeam.rank + yourPoint,
      }),
    ]);

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

    console.log(`PATCH : /team/rank - ${err}`);
    next(createError(500, "Internal Server Error"));
  }
});

module.exports = router;
