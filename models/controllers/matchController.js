const Location = require("../Location");
const Match = require("../Match");
const Message = require("../Message");
const Sports = require("../Sports");
const Team = require("../Team");
const User = require("../User");

const makeRandomNumber = require("../../utils/makeRandomNumber");

const getMatches = async (input) => {
  const { province, city, district, sports, year, month, date } = input;
  const thresMin = new Date(year, (parseInt(month, 10) - 1).toString(), date);
  const thresMax = new Date(year, (parseInt(month, 10) - 1).toString(), (parseInt(date, 10) + 1));

  const _sports = await Sports.findOne({ sports }, "_id");
  const sportsOid = _sports["_id"];

  const matches = await Match.find({
    sports: sportsOid,
    "playtime.start": { $gte: thresMin, $lte: thresMax },
  }).populate({
    path: "playground",
    populate: { path: "address" },
  })
    .populate({
      path: "teams",
      populate: { path: "location" },
    })
    .populate({
      path: "teams",
      populate: { path: "members", select: "name" },
    })
    .populate({
      path: "teams",
      populate: { path: "captin", select: "name" },
    });

  const _matches = matches.filter((match) => {
    const { address } = match.playground;
    return address.province === province
      && address.city === city
      && address.district === district;
  });

  const data = _matches.map((match) => {
    const { address, position } = match.playground;
    const host = match.teams[0];

    return {
      id: match["_id"],
      sports,
      type: match.match_type,
      host: {
        name: host.name,
        captin: host.captin.name,
        province: host.location.province,
        city: host.location.city,
        district: host.location.district,
        emblem: host.emblem,
        members: host.members,
        manner: host.repute.manner,
        ability: host.repute.ability,
      },
      playtime: {
        start: match.playtime.start,
        end: match.playtime.end,
      },
      playground: {
        id: match.playground["_id"],
        name: match.playground.name,
        province: address.province,
        city: address.city,
        district: address.district,
        town: address.town,
        detail: address.detail,
        latitude: position.latitude,
        longitude: position.longitude,
      },
    };
  });

  return data;
};

const createMatch = async (input) => {
  const { sports, month, date, start, end, playground, type, team } = input;

  const [_team, match] = await Promise.all([
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
      is_rank: false,
      is_fixed: false,
    }),
  ]);

  _team.matches.push(match["_id"]);
  await _team.save();

  return match;
};

const createRankMatch = async (input) => {
  const { email, sports, month, date, start, end, playground, type, team } = input;
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
  await myTeam.save();

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

const fixMatch = async (input) => {
  const { matchId, guest } = input;

  const [guestTeam, match] = await Promise.all([
    await Team.findOne({ name: guest.team }),
    await Match.findByIdAndUpdate(matchId, { is_fixed: true }, { new: true }),
  ]);

  const guestTeamOid = guestTeam["_id"];

  match.teams.push(guestTeamOid);
  guestTeam.matches.push(matchId);

  await Promise.all([await match.save(), await guestTeam.save()]);
};

module.exports = { createMatch, createRankMatch, fixMatch, getMatches };
