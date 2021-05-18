const Team = require("../Team");
const User = require("../User");

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
};

const registerUser = async () => {
  const [user, team] = await Promise.all([User.findOne({ email }), Team.findById(teamId)]);

  if (!user) { return "invalid user" }

  const isTeamMember = team.members.some((member) => member === user["_id"]);
  const isMyTeam = user.teams.some((team) => team === team["_id"]);

  if (!isTeamMember && !isMyTeam) {
    team.members.push(user);
    user.teams.push(team);

    await Promise.all([team.save(), user.save()]);
  }

  return "register user";
};

module.exports = { createTeam, registerUser };
