const mongoose = require("mongoose");

// const korReg = /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*$/;

const teamSchema = new mongoose.Schema({
  sports: { type: String, require: true, lowercase: true },
  name: { type: String, require: true, lowercase: true },
  captin: { type: mongoose.Types.ObjectId, ref: "User" },
  members: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  location: { type: mongoose.Types.ObjectId, ref: "Location" },
  // location: {
  //   province: { type: String, require: true, trim: true, match: korReg },
  //   city: { type: String, require: true, trim: true, match: korReg },
  //   district: { type: String, require: true, trim: true, match: korReg },
  // },
  repute: {
    manner: { type: Number, required: true, min: 1, max: 5 },
    ability: { type: Number, required: true, min: 1, max: 5 },
  },
  matches: [{ type: mongoose.Types.ObjectId, ref: "Match" }],
  emblem: { type: String },
});

module.exports = mongoose.model("Team", teamSchema);
