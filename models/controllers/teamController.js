const Location = require("../Location");
const Sports = require("../Sports");
const Team = require("../Team");
const User = require("../User");

const getTeams = async (input) => {
  const { province, city, district, sports } = input;

  const [_location, _sports] = await Promise.all([
    await Location.findOne({ province, city, district }),
    await Sports.findOne({ sports }),
  ]);

  const locationOid = _location["_id"];
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
    const { name, captin, location, emblem, members, repute, rank } = team;

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
      name: name,
      captin: captin.name,
      province: _location.province,
      city: location.city,
      district: location.district,
      emblem: emblem,
      members: members,
      manner: repute.manner,
      ability: repute.ability,
      matches: matches,
      rank: rank,
    };
  });

  return _teams;
};

const createTeam = async (input) => {
  const { email, name, location, sports, imageS3 } = input;

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

const registerUser = async (input) => {
  const { email, teamId } = input;

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

const updateRank = async (input) => {
  const SCORE_FACTOR = 10;
  const WINNING_POINT = 1;
  const DEFEAT_POINT = 0;
  const DRAW_POINT = 0.5;

  const { matchResult, myTeamId, yourTeamId } = input;

  const [myTeam, yourTeam] = await Promise.all([
    await Team.findById(myTeamId),
    await Team.findById(yourTeamId),
  ]);

  const myRankDifference = myTeam.rank - yourTeam.rank;
  const yourRankDifference = -myTeam.rank + yourTeam.rank;

  const myExpectedResult = 1 / (1 + 10 ** (-myRankDifference / 600));
  const yourExpectedResult = 1 / (1 + 10 ** (-yourRankDifference / 600));

  let myResult = 0;
  let yourResult = 0;

  if (matchResult === "승리") {
    myResult = WINNING_POINT;
    yourResult = DEFEAT_POINT;
  } else if (matchResult === "패배") {
    myResult = DEFEAT_POINT;
    yourResult = WINNING_POINT;
  } else if (matchResult === "무승부") {
    myResult = DRAW_POINT;
    yourResult = DRAW_POINT;
  }

  const myPoint = SCORE_FACTOR * (myResult - Math.round(100 * myExpectedResult) / 100);
  const yourPoint = SCORE_FACTOR * (yourResult - Math.round(100 * yourExpectedResult) / 100);

  await Promise.all([
    await Team.findByIdAndUpdate(myTeamId, {
      rank: myTeam.rank + myPoint,
    }),
    await Team.findByIdAndUpdate(yourTeamId, {
      rank: yourTeam.rank + yourPoint,
    }),
  ]);
};

module.exports = { createTeam, getTeams, registerUser, updateRank };
