const Location = require("../Location");
const Sports = require("../Sports");
const Team = require("../Team");
const User = require("../User");

const createTeam = async (email, name, sports, location, imageS3) => {
  const _sports = await Sports.findOne({
    sports: sports.sports,
  }, "_id");
  const sportsOid = _sports["_id"];

  const _location = await Location.findOne({
    province: location.province,
    city: location.city,
    district: location.district,
  }, "_id");
  const locationOid = _location["_id"];

  const _user = await User.findOne({ email }, "_id teams");
  const userOid = _user["_id"];

  const newTeam = await Team.create({
    name,
    location: locationOid,
    sports: sportsOid,
    captin: userOid,
    members: [userOid],
    emblem: imageS3,
  });

  _user.teams.push(newTeam["_id"]);
  await _user.save();
};

module.exports = { createTeam };
