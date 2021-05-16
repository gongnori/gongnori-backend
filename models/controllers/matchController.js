const Match = require("../Match");
const Sports = require("../Sports");
const Team = require("../Team");
const Playground = require("../Playground");
require("dotenv").config();

const createMatch = async (
  sports,
  month,
  date,
  start,
  end,
  playground,
  type,
  team
) => {
  const _sports = await Sports.findOne({sports: sports.sports} , "_id");
  const sportsOid = _sports["_id"];

  const _playground = await Playground.findOne({name: playground.name} , "_id");
  const playgroundOid = _playground["_id"];

  const _team = await Team.findOne({ name: team.name }, "_id matches");
  const teamOid = _team["_id"];

  const match = await Match.create({
    sports: sportsOid,
    playtime: {
      start: new Date(new Date().getFullYear(), month - 1, date, start),
      end: new Date(new Date().getFullYear(), month - 1, date, end),
    },
    playground: playgroundOid,
    match_type: type,
    teams: [teamOid],
  });

  _team.matches.push(match["_id"]);
  _team.save();
};

module.exports = { createMatch };
