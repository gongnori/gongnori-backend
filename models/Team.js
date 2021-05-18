const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  sports: { type: mongoose.Types.ObjectId, ref: "Sports" },
  name: { type: String, require: true, lowercase: true },
  captin: { type: mongoose.Types.ObjectId, ref: "User" },
  members: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  location: { type: mongoose.Types.ObjectId, ref: "Location" },
  repute: {
    manner: { type: Number, required: true, default: 5, min: 1, max: 5 },
    ability: { type: Number, required: true, default: 5, min: 1, max: 5 },
  },
  matches: [{ type: mongoose.Types.ObjectId, ref: "Match" }],
  emblem: { type: String },
  rank: { type: Number },
});

module.exports = mongoose.model("Team", teamSchema);
