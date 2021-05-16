const Location = require("../Location");
const User = require("../User");

const getMyTeams = async (email) => {
  const user = await User.findOne({ email })
    .populate({ path: "teams", populate: { path: "location" }})
    .populate({ path: "teams", populate: { path: "captin" }})
    .populate({ path: "teams", populate: { path: "sports" }})
    .populate({ path: "teams", populate: { path: "members" }})

  if (!user.teams) { return [] }

  const teams = user.teams.map((team) => {
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
    };
  });

  return teams;
};

const getMyLocations = async (email) => {
  const user = await User.findOne({ email })
    .populate("locations");

  if (!user.locations) { return [] }

  const locations = user.locations.map((location) => {
    return {
      id: location["_id"],
      province: location.province,
      city: location.city,
      district: location.district,
      latitude: location.position.latitude,
      longitude: location.position.longitude,
    };
  });

  return locations;
};

const saveMyLocations = async (email, locations) => {
  const locationsOids = [];

  for (let i = 0; i < locations.length; i++) {
    const { province, city, district } =  locations[i];
    const locationOid = await Location.findOne({ province, city, district }, "_id");

    locationsOids.push(locationOid);
  }

  await User.findOneAndUpdate({ email }, { locations: locationsOids });
};

module.exports = { getMyTeams, getMyLocations, saveMyLocations };
