/**
 *  @function it returns user, match, team mockdb as json, based on playground database
 */

const mongoose = require("mongoose");
const { uniqueNamesGenerator, adjectives, names } = require('unique-names-generator');

const Match = require("../models/Match");
const Playground = require("../models/Playground");
const Team = require("../models/Team");
const User = require("../models/User");

const makeRandomNumber = require("./makeRandomNumber");

const koreanNames = require("../models/koreanName.json");
const locations = require("../models/location.json");
const playgrounds = require("../models/playground.json");

const makeMock = () => {
  const memberNum = 10;
  const teamNum = 10;
  const matchNum = 5;

  const teams = [];
  const users = [];
  const matches = [];

  const playgroundsWithOid = playgrounds.map((playground) => {
    const playgroundOid = mongoose.Types.ObjectId();
    playground._id = playgroundOid;

    return playground;
  });

  for (let i = 0; i < teamNum; i++) {
    const teamOid = mongoose.Types.ObjectId();
    const randomLocationIdx = makeRandomNumber(0, 9);
    const randomManner = makeRandomNumber(1, 5);
    const randomAbility = makeRandomNumber(1, 5);
    const randomTeamNameIdx = makeRandomNumber(0, 199);

    const team = {
      _id: teamOid,
      name: `FC${koreanNames[randomTeamNameIdx]}`,
      sports: "football",
      members: [],
      captin: null,
      location: locations[randomLocationIdx],
      repute: {
        manner: randomManner,
        ability: randomAbility,
      },
      matches: [],
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
      const userName = koreanNames[randomUserNameIdx];

      const randomLocationIdx = makeRandomNumber(0, locations.length - 2);
      const userLocations = [locations[randomLocationIdx], locations[randomLocationIdx + 1]];

      const user = {
        _id: userOid,
        teams: [teamOid],
        name: userName,
        email: `${email}@gmail.com`,
        locations: [userLocations],
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
        sports: "football",
        created_at: Date.now(),
        playtime: {
          start,
          end,
        },
        playground: playgroundsWithOid[randomPlaygroundIdx]._id,
        match_type: "5:5",
        teams: [teamOid],
      };

      matches.push(match);
    }

    teams.push(team);
  }

  const oId = mongoose.Types.ObjectId();

  users.push({
    _id: oId,
    teams: [teams[0]._id, teams[1]._id],
    name: "minho kwon",
    email: "minhob38@gmail.com",
    locations: [
      {
        province: "경기도",
        city: "용인시",
        district: "수지구",
      },
      {
        province: "경기도",
        city: "용인시",
        district: "기흥구",
      }],
  });

  teams[0].captin = oId;
  teams[0].members.push(oId);

  return { users, teams, matches, playgroundsWithOid };
};

const makeMockDB = async () => {
  const { users, teams, matches, playgroundsWithOid } = makeMock();

  await Playground.remove();
  await playgroundsWithOid.forEach((doc) => Playground.create(doc));

  await Match.remove();
  await matches.forEach((doc) => Match.create(doc));

  await User.remove();
  await users.forEach((doc) => User.create(doc));

  await Team.remove();
  await teams.forEach((doc) => Team.create(doc));
};

module.exports = makeMockDB;
