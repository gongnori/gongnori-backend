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
    const { captin, location, emblem, members, repute, rank } = team;

    const matches = team.matches.map((match) => {
      const { playtime, playground } = match;
      const { name, address } = playground;
console.log(match.teams[1])
      return {
        id: match["_id"],
        start: playtime.start,
        end: playtime.end,
        playgroundName: name,
        province: address.province,
        city: address.city,
        district: address.district,
        teams: match.teams[1]
          ? [match.teams[0].name, match.teams[1].name]
          : [match.teams[0].name],
      };
    });

    return {
      id: team["_id"],
      name: team.name,
      captin: captin.name,
      province: location.province,
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

  return teams;
};

const getMyLocations = async (email) => {
  const user = await User.findOne({ email })
    .populate("locations");

  if (!user.locations) { return [] }

  const locations = user.locations.map((location) => {
    const { province, city, district, position } = location;

    return {
      id: location["_id"],
      province: province,
      city: city,
      district: district,
      latitude: position.latitude,
      longitude: position.longitude,
    };
  });

  return locations;
};

const saveMyLocations = async (email, locations) => {
  const locationsOids = [];

  for (let i = 0; i < locations.length; i++) {
    const { province, city, district } = locations[i];
    const locationOid = await Location.findOne({ province, city, district }, "_id");

    locationsOids.push(locationOid);
  }

  await User.findOneAndUpdate({ email }, { locations: locationsOids });
};

module.exports = { getMyTeams, getMyLocations, saveMyLocations };
