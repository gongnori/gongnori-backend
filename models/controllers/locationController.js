const Location = require("../Location");

const getAppLocations = async () => {
  const locations = await Location.find();

  if (!locations) { return [] }

  return locations.map((location) => {
    return {
      id: location["_id"],
      province: location.province,
      city: location.city,
      district: location.district,
      latitude: location.position.latitude,
      longitude: location.position.longitude,
    };
  });
};

module.exports = { getAppLocations };
