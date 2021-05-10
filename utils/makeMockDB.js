const mongoose = require("mongoose");
const User = require("../models/User");
const Match = require("../models/Match");
const PlayGround = require("../models/PlayGround");
// console.log(Match)
// console.log(PlayGround)

const matchMock = require("../models/matchMock.json");
const playGroundMock = require("../models/playGroundMock.json");
// console.log(matchMock)
// console.log(playGroundMock)

const makeMockDB = async () => {
  await Match.remove();
  await matchMock.forEach((doc) => Match.create(doc));

  await PlayGround.remove();
  await playGroundMock.forEach((doc) => PlayGround.create(doc));
};

module.exports = makeMockDB;
