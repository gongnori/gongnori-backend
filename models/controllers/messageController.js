const Match = require("../Match");
const Message = require("../Message");
const User = require("../User");

const createMessage = async (email, matchId, teamId) => {
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

module.exports = { createMessage };
