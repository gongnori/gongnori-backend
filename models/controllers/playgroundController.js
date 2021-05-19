const Playground = require("../Playground");

const getAppPlaygrounds = async () => {
  const playgrounds = await Playground.find();

  if (!playgrounds) { return [] }

  return playgrounds.map((playground) => {
    const { sports, name, address, contact, position } = playground;

    return {
      id: playground["_id"],
      sports,
      name,
      province: address.province,
      city: address.city,
      district: address.district,
      town: address.town,
      detail: address.detail,
      contact,
      latitude: position.latitude,
      longitude: position.longitude,
    };
  });
};

module.exports = { getAppPlaygrounds };
