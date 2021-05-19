const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  sports: { type: mongoose.Types.ObjectId, ref: "Sports" },
  created_at: { type: Date, require: true, default: Date.now() },
  playtime: {
    start: { type: Date, require: true, default: Date.now() },
    end: { type: Date, require: true, default: Date.now() },
  },
  playground: { type: mongoose.Types.ObjectId, ref: "Playground" },
  match_type: { type: String, require: true, lowercase: true },
  teams: [{ type: mongoose.Types.ObjectId, ref: "Team" }],
  is_rank: { type: Boolean },
});

module.exports = mongoose.model("Match", matchSchema);
