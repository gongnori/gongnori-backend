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

module.exports = { createTeam };
