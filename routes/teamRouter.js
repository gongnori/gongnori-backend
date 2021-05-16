const aws = require("aws-sdk");
const express = require("express");
const createError = require("http-errors");
const multer = require("multer");
const multerS3 = require("multer-s3");
const jwt = require("jsonwebtoken");

const Location = require("../models/Location");
const Team = require("../models/Team");
const User = require("../models/User");

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
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    }
  }),
});

router.get("/my-team/:myTeamId", async (req, res, next) => {
  try {
    const { myTeamId } = req.params;
    const team = await Team.findById({_id: myTeamId })
      .populate("captin", "name email")
      .populate("members", "name email")
      .populate("location")
      .populate({ path: "matches", populate: { path: "teams", select: "name" } })
      .populate({ path: "matches", populate: { path: "playground", select: "name address" }});

    res.status(200).json({
      message: "success",
      data: team,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      message: "fail",
      data: null,
      error: "error",
    });

    console.log(`GET : /team/my-team/:myTeamId - ${err}`);
    next(createError(500, "Internal Server Error"));
  }
});

router.post("/", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const { email } = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    const { name, location, sports, imageS3 } = req.body;
    const team = await Team.findOne({ name });

    if (!team) {
      const loationOid = await Location.findOne({
        province: location.province,
        city: location.city,
        district: location.district,
      }, "_id");

      const user = await User.findOne({ email });

      const newTeam = await Team.create({
        name,
        location: loationOid,
        sports,
        captin:
        user,
        members: [user],
        emblem: imageS3,
      });

      user.teams.push(newTeam._id);
      await user.save();

      return res.status(200).json({
        message: "success",
        data: newTeam,
        error: null,
      });
    }
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

router.get("/my", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const { email } = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    const user = await User.findOne({ email }).populate("teams", "_id name");

    const teams = user.teams.map((team) => {
      const id = team._id;
      const name = team.name;

      return { id, name };
    });

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

module.exports = router;