const mongoose = require("mongoose");
const User = require("../models/User");
const Match = require("../models/Match");

const matchMock = require("../models/matchMock.json");

const makeMockDB = async () => {
  await Match.remove();
  await matchMock.forEach((doc) => Match.create(doc));
};

module.exports = makeMockDB;
