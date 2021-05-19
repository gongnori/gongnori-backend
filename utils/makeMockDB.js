/**
 * @function it makes user, match, team mockdb based on playground and location database
 * @param {boolean} isMock
 */

const mongoose = require("mongoose");
const { uniqueNamesGenerator, adjectives, names } = require("unique-names-generator");

const Location = require("../models/Location");
const Match = require("../models/Match");
const Message = require("../models/Message");
const Playground = require("../models/Playground");
const Sports = require("../models/Sports");
const Team = require("../models/Team");
const User = require("../models/User");

const koreanNames = require("../models/koreanName.json");
const koreanSurNames = require("../models/koreanSurName.json");
const locations = require("../models/location.json");
const playgrounds = require("../models/playground.json");
const emblems = require("../models/emblems.json");
const sports = require("../models/sports.json");

const makeRandomNumber = require("./makeRandomNumber");

const makeMock = () => {
  const memberNum = 10;
  const teamNum = 30;
  const matchNum = 5;

  const teams = [];
  const users = [];
  const matches = [];

  const locationsWithOid = locations.map((location) => {
    const locationOid = mongoose.Types.ObjectId();
    location._id = locationOid;

    return location;
  });

  const playgroundsWithOid = playgrounds.map((playground) => {
    const playgroundOid = mongoose.Types.ObjectId();
    playground._id = playgroundOid;

    return playground;
  });

  const sportsWithOid = sports.map((item) => {
    const itemOid = mongoose.Types.ObjectId();
    item._id = itemOid;

    return item;
  });

  for (let i = 0; i < teamNum; i++) {
    const teamOid = mongoose.Types.ObjectId();
    const randomLocationIdx = makeRandomNumber(0, 1);
    const randomManner = makeRandomNumber(1, 5);
    const randomAbility = makeRandomNumber(1, 5);
    const randomSportsIdx = makeRandomNumber(0, 2);
    const randomEmblemIdx = makeRandomNumber(0, emblems.length - 1);
    const randomRankPoint = makeRandomNumber(800, 1200);

    const team = {
      _id: teamOid,
      name: `${koreanNames[i]}팀`,
      sports: sportsWithOid[randomSportsIdx],
      members: [],
      captin: null,
      location: locationsWithOid[randomLocationIdx],
      repute: {
        manner: randomManner,
        ability: randomAbility,
      },
      matches: [],
      emblem: emblems[randomEmblemIdx],
      rank: randomRankPoint,
    };

    for (let j = 0; j < memberNum; j++) {
      const userOid = mongoose.Types.ObjectId();
      team.members.push(userOid);
      team.captin = userOid;

      const email = uniqueNamesGenerator({
        dictionaries: [adjectives, names],
        separator: "",
      });

      const randomUserNameIdx = makeRandomNumber(0, koreanNames.length - 1);
      const randomUserSurNameIdx = makeRandomNumber(0, koreanSurNames.length - 1);
      const userName = `${koreanSurNames[randomUserSurNameIdx]}${koreanNames[randomUserNameIdx]}`;

      const _randomLocationIdx = makeRandomNumber(0, locations.length - 2);
      const userLocations = [
        locationsWithOid[_randomLocationIdx],
        locationsWithOid[_randomLocationIdx + 1],
      ];

      const user = {
        _id: userOid,
        teams: [teamOid],
        name: userName,
        email: `${email}@gmail.com`,
        locations: userLocations,
      };

      users.push(user);
    }

    for (let k = 0; k < matchNum; k++) {
      const matchOid = mongoose.Types.ObjectId();
      const randomPlaygroundIdx = makeRandomNumber(0, playgroundsWithOid.length - 1);
      const start = new Date();

      team.matches.push(matchOid);

      start.setDate(start.getDate() + makeRandomNumber(0, 6));
      start.setHours(makeRandomNumber(6, 20));
      start.setMinutes(0);

      const end = new Date(start);
      end.setHours(end.getHours() + 2);

      const match = {
        _id: matchOid,
        sports: sportsWithOid[randomSportsIdx],
        created_at: Date.now(),
        playtime: {
          start,
          end,
        },
        playground: playgroundsWithOid[randomPlaygroundIdx]._id,
        match_type: sports[randomSportsIdx]["match_types"][1],
        teams: [teamOid],
        is_rank: [true, false][makeRandomNumber(0, 1)],
      };

      matches.push(match);
    }

    teams.push(team);
  }

  const oId1 = mongoose.Types.ObjectId();
  const oId2 = mongoose.Types.ObjectId();

  users.push({
    _id: oId1,
    teams: [teams[0]._id, teams[1]._id],
    name: "minho kwon",
    email: "minhob38@gmail.com",
    locations: [
      locationsWithOid[0],
      locationsWithOid[1],
    ],
  });

  users.push({
    _id: oId2,
    teams: [teams[2]._id, teams[3]._id],
    name: "jerry",
    email: "skunkworksflightcontrol@gmail.com",
    locations: [
      locationsWithOid[0],
      locationsWithOid[5],
    ],
  });

  teams[0].captin = oId1;
  teams[0].members.push(oId1);
  teams[1].captin = oId1;
  teams[1].members.push(oId1);

  teams[2].captin = oId2;
  teams[2].members.push(oId2);
  teams[3].captin = oId2;
  teams[3].members.push(oId2);

  return { users, teams, matches, locationsWithOid, playgroundsWithOid };
};

const makeMockDB = async (isMock) => {
  const { users, teams, matches, locationsWithOid, playgroundsWithOid } = makeMock();

  await Location.remove();
  await Match.remove();
  await Playground.remove();
  await Sports.remove();
  await Team.remove();
  await User.remove();
  await Message.remove();

  await locationsWithOid.forEach((doc) => Location.create(doc));
  await sports.forEach((doc) => Sports.create(doc));
  await playgroundsWithOid.forEach((doc) => Playground.create(doc));

  if (!isMock) { return }

  await matches.forEach((doc) => Match.create(doc));
  await teams.forEach((doc) => Team.create(doc));
  await users.forEach((doc) => User.create(doc));
};

module.exports = makeMockDB;
