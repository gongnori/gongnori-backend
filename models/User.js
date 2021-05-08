const mongoose = require("mongoose");

const emailReg = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

const userSchema = new mongoose.Schema({
  uid: { type: String, require: true, unique: true },
  name: { type: String, require: true, lowercase: true },
  email: { type: String, require: true, unique: true, lowercase: true, match: emailReg },
  desc: { type: String, default: "", maxLength: 100 },
  messages: [{ type: mongoose.Types.ObjectId, ref: "Message" }],
  teams: [{ type: mongoose.Types.ObjectId, ref: "Team" }],
  record: {
    win: { type: Number, default: 0, min: 0 },
    lose: { type: Number, default: 0, min: 0 },
    draw: { type: Number, default: 0, min: 0 },
  },
});

module.exports = mongoose.model("User", userSchema);
