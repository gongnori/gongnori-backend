const mongoose = require("mongoose");

const korReg = /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*$/;

const sportsSchema = new mongoose.Schema({
  sports: {
    type: String,
    require: true,
    lowercase: true,
    enum: ["football", "baseball", "basketball"],
  },
  match_types: [{ type: String, require: true }],
  korean_name: { type: String, require: true, match: korReg },
});

module.exports = mongoose.model("Sports", sportsSchema);
