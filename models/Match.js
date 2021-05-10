const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  sports: { type: String, require: true, lowercase: true },
  created_at: { type: Date, require: true, default: Date.now() },
  playtime: {
    start: { type: Date, require: true, default: Date.now() },
    end: { type: Date, require: true, default: Date.now() },
  },
  playground: { type: String, require: true, lowercase: true }, // 나중에 oid로
  match_type: { type: String, require: true, lowercase: true }, // 종목에 따른 validation
  teams: {
    home: { type: String, require: true },
    away: { type: String, require: true },
  }, // 나중에 oid로
});

module.exports = mongoose.model("Match", matchSchema);
