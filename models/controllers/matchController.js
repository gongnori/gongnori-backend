const Match = require("../Match");
const Sports = require("../Sports");
const User = require("../User");
const Location = require("../Location");
const Message = require("../Message");

const Team = require("../Team");
const Playground = require("../Playground");
const makeRandomNumber = require("../../utils/makeRandomNumber");

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
  const _team = await Team.findById(team.id, "matches"); // promise all

  const match = await Match.create({
    sports: sports.id,
    playtime: {
      start: new Date(new Date().getFullYear(), month - 1, date, start),
      end: new Date(new Date().getFullYear(), month - 1, date, end),
    },
    playground: playground.id,
    match_type: type,
    teams: [team.id],
    is_rank: false,
  });

  _team.matches.push(match["_id"]);
  _team.save();

  return match;
};

const createRankMatch = async (data) => {
  const {
    email,
    sports,
    month,
    date,
    start,
    end,
    playground,
    type,
    team,
  } = data;

  const { province, city, district } = playground;

  const [myTeam, match, user, location] = await Promise.all([
    await Team.findById(team.id, "matches"),
    await Match.create({
      sports: sports.id,
      playtime: {
        start: new Date(new Date().getFullYear(), month - 1, date, start),
        end: new Date(new Date().getFullYear(), month - 1, date, end),
      },
      playground: playground.id,
      match_type: type,
      teams: [team.id],
      is_rank: true,
    }),
    await User.findOne({ email }, "_id messages"),
    await Location.findOne({ province, city, district }, "_id"),
  ]);

  myTeam.matches.push(match["_id"]);
  myTeam.save();

  const locationOid = location["_id"];
  const opponents = await Team.find({
    $and: [{ location: locationOid }, { sports: sports.id }],
  });

  const opponent = opponents[makeRandomNumber(0, opponents.length - 1)];

  const [message, opponentCaptin] = await Promise.all([
    await Message.create({
      match: match["_id"],
      host: { captin: user["_id"], team: myTeam["_id"] },
      guest: { captin: opponent.captin, team: opponent["_id"] },
    }),
    await User.findById(opponent.captin, "messages"),
  ]);

  user.messages.push(message["_id"]);
  opponent.matches.push(match["_id"]);
  opponentCaptin.messages.push(message["_id"]);

  await Promise.all([
    await opponent.save(),
    await opponentCaptin.save(),
    await user.save(),
  ]);

  return match;
};

module.exports = { createMatch, createRankMatch };
