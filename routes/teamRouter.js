const aws = require("aws-sdk");
const express = require("express");
const createError = require("http-errors");
const multer = require("multer");
const multerS3 = require("multer-s3");
const router = express.Router();

const Team = require("../models/Team");
require("dotenv").config();

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

    console.error(`GET : /team/my-team/:myTeamId - ${err.messsage}`);
    next(createError(500, "Internal Server Error"));
  }
});

router.post("/", (req, res, next) => {
  try {
    console.log(req.body)
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

    console.error(`POST : /team/emblem - ${err.messsage}`);
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

    console.error(`POST : /team/emblem - ${err.messsage}`);
    next(createError(500, "Internal Server Error"));
  }
});

module.exports = router;
