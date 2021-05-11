/**
 *  @function it returns user, match, team mockdb as json, based on playground database
 *
 *
 *
 */

const mongoose = require("mongoose");
const { uniqueNamesGenerator, adjectives, names } = require('unique-names-generator');

const User = require("../models/User");
const Team = require("../models/Team");
const Match = require("../models/Match");
const Playground = require("../models/Playground");

const matchMock = require("../models/matchMock.json");
const playgrounds = require("../models/playground.json");
const koreanNames = require("../models/koreanName.json");
const location = require("../models/locationMock.json");


const makeMock = () => {
  const playgroundOids = [];
  const memberNum = 10;
  const teamNum = 10;

  playgrounds.forEach((playground) => {
    const playgroundOid = mongoose.Types.ObjectId();
    playground._id = playgroundOid;
    playgroundOids.push(playgroundOid);
  });

  const teams = [];
  const users = [];

  for (let i = 0; i < teamNum; i++) {
    const randomLocationIdx = Math.min(Math.floor(10 * Math.random()), 9);
    const randomManner = Math.min(Math.floor(5 * Math.random()) + 1, 5);
    const randomAbility = Math.min(Math.floor(5 * Math.random()) + 1, 5);
    const randomTeamNameIdx = Math.min(Math.floor(200 * Math.random()), 198);

    const team1 = {
      name: `FC ${koreanNames[randomTeamNameIdx]}`,
      sports: "football",
      members: [],
      captin: null,
      location: location[randomLocationIdx],
      repute: {
        manner: randomManner,
        ability: randomAbility,
      },
    };

    const team2 = {
      name: `AS ${koreanNames[randomTeamNameIdx + 1]}`,
      sports: "football",
      members: [],
      captin: null,
      location: location[randomLocationIdx],
      repute: {
        manner: randomManner,
        ability: randomAbility,
      },
    };

    const teamOid1 = mongoose.Types.ObjectId();
    const teamOid2 = mongoose.Types.ObjectId();

    for (let j = 0; j < memberNum; j++) {
      const userOid = mongoose.Types.ObjectId();
      team1.members.push(userOid);
      team2.members.push(userOid);
      team1.captin = userOid;
      team2.captin = userOid;

      const email = uniqueNamesGenerator({
        dictionaries: [adjectives, names],
        separator: "",
      });

      const randomUserNameIdx = Math.min(Math.floor(100 * Math.random()), 99);
      const userName = koreanNames[randomUserNameIdx];

      const randomLocationIdx = Math.min(Math.floor(10 * Math.random()), 8);
      const userLocations = [
        location[randomLocationIdx],
        location[randomLocationIdx + 1]
      ];

      const user = {
        _id: userOid,
        teams: [teamOid1, teamOid2],
        name: userName,
        email: `${email}@gmail.com`,
        location: userLocations,
      };

      users.push(user);
    }

    teams.push(team1, team2);
  }

  return { users, teams };
};

const makeMockDB = async () => {
  // await Match.remove();
  // await matchMock.forEach((doc) => Match.create(doc));

  // await Playground.remove();
  // await playgroundMock.forEach((doc) => Playground.create(doc));
  const { users, teams } = makeMock();
// console.log(teams)

  await User.remove();
  await users.forEach((doc) => User.create(doc));
console.log("!")
  await Team.remove();
  await teams.forEach((doc) => Team.create(doc));
console.log("!")
};

module.exports = makeMockDB;
