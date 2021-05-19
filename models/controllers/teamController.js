const Location = require("../Location");
const Sports = require("../Sports");
const Team = require("../Team");
const User = require("../User");

const getTeams = async (province, city, district, sports) => {
  const [location, _sports] = await Promise.all([
    await Location.findOne({ province, city, district }),
    await Sports.findOne({ sports }),
  ]);

  const locationOid = location["_id"];
  const sportsOid = _sports["_id"];

  const teams = await Team.find({
    $and: [{ location: locationOid }, { sports: sportsOid }],
  }).populate("location")
    .populate("captin")
    .populate("sports")
    .populate("members")
    .populate({ path: "matches", populate: { path: "playground" } })
    .populate({ path: "matches", populate: { path: "teams" } });

  const _teams = teams.map((team) => {
    const matches = team.matches.map((match) => {
      const { playtime, playground } = match;

      return {
        start: playtime.start,
        end: playtime.end,
        playgroundName: playground.name,
        province: playground.address.province,
        city: playground.address.city,
        district: playground.address.district,
        teams: match.teams[1]
          ? [match.teams[0].name, match.teams[1].name]
          : [match.teams[0].name],
      };
    });

    return {
      id: team["_id"],
      name: team.name,
      captin: team.captin.name,
      province: team.location.province,
      city: team.location.city,
      district: team.location.district,
      emblem: team.emblem,
      members: team.members,
      manner: team.repute.manner,
      ability: team.repute.ability,
      matches: matches,
      rank: team.rank,
    };
  });

  return _teams;
};

const createTeam = async (email, name, sports, location, imageS3) => {
  const _user = await User.findOne({ email }, "_id teams");
  const userOid = _user["_id"];

  const _team = await Team.create({
    name,
    location: location.id,
    sports: sports.id,
    captin: userOid,
    members: [userOid],
    emblem: imageS3,
  });

  _user.teams.push(_team["_id"]);
  await _user.save();

  return _team;
};

const registerUser = async (email, teamId) => {
  const [user, team] = await Promise.all([
    User.findOne({ email }, ""),
    Team.findById(teamId),
  ]);

  if (!user) { return }

  const isTeamMember = team.members.some((memberOid) => {
    return memberOid.toString() === user["_id"].toString();
  });

  const isMyTeam = user.teams.some((teamOid) => {
    return teamOid.toString() === team["_id"].toString();
  });

  if (isTeamMember || isMyTeam) { return }

  team.members.push(user);
  user.teams.push(team);

  await Promise.all([team.save(), user.save()]);

  return user;
};

module.exports = { createTeam, getTeams, registerUser };
