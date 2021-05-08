const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  sports: { type: String, require: true, lowercase: true },
  created_at: { type: Date, require: true, default: Date.now() },
  play_time: {
    start: { type: Date, require: true, default: Date.now() + 2 * 60 * 60 * 1000 },
    end: { type: Date, require: true, default: Date.now() + 4 * 60 * 60 * 1000 },
  },
  play_ground: { type: String, require: true, lowercase: true }, // 나중에 oid로
  match_type: { type: String, require: true, lowercase: true }, // 종목에 따른 validation
  teams: {
    home: { type: String, require: true },
    away: { type: String, require: true },
  }, // 나중에 oid로
});

module.exports = mongoose.model("Match", matchSchema);
