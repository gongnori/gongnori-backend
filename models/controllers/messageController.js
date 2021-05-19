const Match = require("../Match");
const Message = require("../Message");
const User = require("../User");

const createMessage = async (input) => {
  const { email, matchId, teamId } = input;

  const user = await User.findOne({ email }).populate("messages");

  const hasMessage = user.messages.some((message) => {
    return message.match.toString() === matchId.toString();
  });

  if (hasMessage) { return }

  const matches = await Match.findById(matchId, "teams")
    .populate("teams", "captin");

  const hostCaptinOid = matches.teams[0].captin;

  const [message, hostCaptin] = await Promise.all([
    await Message.create({
      match: matchId,
      host: { captin: hostCaptinOid, team: matches.teams[0]["_id"] },
      guest: { captin: user["_id"], team: teamId },
    }),
    await User.findById(hostCaptinOid),
  ]);

  hostCaptin.messages.push(message["_id"]);
  await hostCaptin.save();

  user.messages.push(message["_id"]);
  await user.save();

  return message;
};

const getMyMessages = async (email) => {
  const user = await User.findOne({ email }, "messages")
    .populate({ path: "messages", populate: { path: "match", populate: { path: "sports" } } })
    .populate({ path: "messages", populate: { path: "match", populate: { path: "playground" } } })
    .populate({ path: "messages", populate: { path: "host", populate: { path: "captin", select: "_id name" } } })
    .populate({ path: "messages", populate: { path: "host", populate: { path: "team", select: "_id name" } } })
    .populate({ path: "messages", populate: { path: "guest", populate: { path: "captin", select: "_id name" } } })
    .populate({ path: "messages", populate: { path: "guest", populate: { path: "team", select: "_id name" } } });

  const data = user.messages.map((message) => {
    const { match, host, guest } = message;
    const { sports, playground, playtime } = match;

    return {
      id: message["_id"],
      host: {
        captin: host.captin.name,
        team: host.team.name,
        teamId: host.team["_id"],
      },
      guest: {
        captin: guest.captin.name,
        team: guest.team.name,
        teamId: guest.team["_id"],
      },
      matchId: match["_id"],
      sports: sports["korean_name"],
      type: match["match_type"],
      playtime: {
        start: playtime.start,
        end: playtime.end,
      },
      playground: {
        name: playground.name,
        city: playground.address.city,
        district: playground.address.district,
      },
    };
  });

  return data;
};

module.exports = { createMessage, getMyMessages };
