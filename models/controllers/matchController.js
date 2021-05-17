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
  team,
) => {
  const _team = await Team.findById(team.id, "matches");

  const match = await Match.create({
    sports: sports.id,
    playtime: {
      start: new Date(new Date().getFullYear(), month - 1, date, start),
      end: new Date(new Date().getFullYear(), month - 1, date, end),
    },
    playground: playground.id,
    match_type: type,
    teams: [team.id],
  });

  _team.matches.push(match["_id"]);
  _team.save();
};

module.exports = { createMatch };
