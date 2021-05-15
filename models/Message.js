const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  match: { type: mongoose.Types.ObjectId, ref: "Match" },
  participants: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  chats: [{ type: String }],
});

module.exports = mongoose.model("Message", messageSchema);
