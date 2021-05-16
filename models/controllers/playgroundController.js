const Playground = require("../Playground");

const getAppPlaygrounds = async () => {
  const playgrounds = await Playground.find();

  if (!playgrounds) { return [] }

  return playgrounds.map((playground) => {
    return {
      id: playground["_id"],
      sports: playground.sports,
      name: playground.name,
      province: playground.address.province,
      city: playground.address.city,
      district: playground.address.district,
      town: playground.address.town,
      detail: playground.address.detail,
      contact: playground.contact,
      latitude: playground.position.latitude,
      longitude: playground.position.longitude,
    };
  });
};

module.exports = { getAppPlaygrounds };
