const mongoose = require("mongoose");
const User = require("../models/User");
const Match = require("../models/Match");
const Playground = require("../models/Playground");
// console.log(Match)
// console.log(Playground)

const matchMock = require("../models/matchMock.json");
const playgroundMock = require("../models/playgroundMock.json");
// console.log(matchMock)
// console.log(playgroundMock)

const makeMockDB = async () => {
  await Match.remove();
  await matchMock.forEach((doc) => Match.create(doc));

  await Playground.remove();
  await playgroundMock.forEach((doc) => Playground.create(doc));
};

module.exports = makeMockDB;
