const aws = require("aws-sdk");
const express = require("express");
const createError = require("http-errors");
const multer = require("multer");
const multerS3 = require("multer-s3");
const jwt = require("jsonwebtoken");

const Location = require("../models/Location");
const Team = require("../models/Team");
const User = require("../models/User");
const Sports = require("../models/Sports");

const { createTeam, registerUser } = require("../models/controllers/teamController");
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
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    }
  }),
});

// router.get("/my-team/:myTeamId", async (req, res, next) => {
//   try {
//     const { myTeamId } = req.params;
//     const team = await Team.findById({_id: myTeamId })
//       .populate("captin", "name email")
//       .populate("members", "name email")
//       .populate("location")
//       .populate({ path: "matches", populate: { path: "teams", select: "name" } })
//       .populate({ path: "matches", populate: { path: "playground", select: "name address" }});

//     res.status(200).json({
//       message: "success",
//       data: team,
//       error: null,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "fail",
//       data: null,
//       error: "error",
//     });

//     console.log(`GET : /team/my-team/:myTeamId - ${err}`);
//     next(createError(500, "Internal Server Error"));
//   }
// });

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

router.patch("/members", async (req, res, next) => {
  try {
    const { email, teamId } = req.body;
    const result = await registerUser(email, teamId);

    if (result === "invalid user") {
      res.status(200).json({
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

router.get("/", async (req, res, next) => {
  try {
    const { province, city, district, sports } = req.query;

    const [location, _sports] = await Promise.all([
      await Location.findOne({ province, city, district }),
      await Sports.findOne({ sports }),
    ]);

    const locationOid = location["_id"];
    const sportsOid = _sports["_id"];

    const teams = await Team.find({
      $and: [{ location: locationOid }, { sports: sportsOid }]
    }).populate("location")
      .populate("caption")
      .populate("sports")
      .populate("members")
      .populate({ path: "matches", populate: { path: "playground" } })
      .populate({ path: "matches", populate: { path: "teams" } });

    const _teams = teams.map((team) => {
      const matches = team.matches.map((match) => {
        const { playtime, playground } = match;

        return {
          start: playtime.start,
          end: playtime.end,
          playgroundName: playground.name,
          province: playground.address.province,
          city: playground.address.city,
          district: playground.address.district,
          teams: match.teams[1]
            ? [match.teams[0].name, match.teams[1].name]
            : [match.teams[0].name],
        };
      });

      return {
        id: team["_id"],
        name: team.name,
        captin: team.captin.name,
        province: team.location.province,
        city: team.location.city,
        district: team.location.district,
        emblem: team.emblem,
        members: team.members,
        manner: team.repute.manner,
        ability: team.repute.ability,
        matches: matches,
        rank: team.rank,
      };
    });

    res.status(200).json({
      message: "success",
      data: _teams,
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

module.exports = router;
