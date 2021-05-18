const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  match: { type: mongoose.Types.ObjectId, ref: "Match" },
  participants: {
    host: { type: mongoose.Types.ObjectId, ref: "User" },
    guest: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  host: {
    captin: { type: mongoose.Types.ObjectId, ref: "User" },
    team: { type: mongoose.Types.ObjectId, ref: "Team" },
  },
  guest: {
    captin: { type: mongoose.Types.ObjectId, ref: "User" },
    team: { type: mongoose.Types.ObjectId, ref: "Team" },
  },
  chats: [{
    name: { type: String },
    content: { type: String },
    date: { type: Date, default: Date.now()}
  }],
  rank: { type: Number },
});

module.exports = mongoose.model("Message", messageSchema);
