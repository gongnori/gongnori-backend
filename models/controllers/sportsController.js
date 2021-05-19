const Sports = require("../Sports");

const getAppSports = async () => {
  const sports = await Sports.find();

  if (!sports) { return [] }

  return sports.map((item) => {
    return {
      id: item["_id"],
      sports: item.sports,
      koreanName: item["korean_name"],
      matchTypes: item["match_types"],
    };
  });
};

module.exports = { getAppSports };
