const mongoose = require("mongoose");

const emailReg = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
const korReg = /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*$/;

const userSchema = new mongoose.Schema({
  name: { type: String, require: true, lowercase: true },
  email: { type: String, require: true, unique: true, lowercase: true, match: emailReg },
  locations: [{
    province: { type: String, require: true, trim: true, match: korReg },
    city: { type: String, require: true, trim: true, match: korReg },
    district: { type: String, require: true, trim: true, match: korReg },
  }],
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
