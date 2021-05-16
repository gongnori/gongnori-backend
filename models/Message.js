const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  match: { type: mongoose.Types.ObjectId, ref: "Match" },
  participants: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  chats: [{
    name: { type: String },
    content: { type: String },
    date: { type: Date, default: Date.now()}
  }],
});

module.exports = mongoose.model("Message", messageSchema);
