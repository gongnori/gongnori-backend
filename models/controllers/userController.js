const Location = require("../Location");
const User = require("../User");

const getMyTeams = async (email) => {
  const user = await User.findOne({ email })
    .populate({ path: "teams", populate: { path: "location" } })
    .populate({ path: "teams", populate: { path: "captin" } })
    .populate({ path: "teams", populate: { path: "sports" } })
    .populate({ path: "teams", populate: { path: "members" } })
    .populate({ path: "teams", populate: { path: "matches", populate: { path: "playground" } } })
    .populate({ path: "teams", populate: { path: "matches", populate: { path: "teams" } } });

  if (!user.teams) { return [] }

  const teams = user.teams.map((team) => {
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
