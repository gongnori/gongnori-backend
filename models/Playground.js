const mongoose = require("mongoose");
const korReg = /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*$/;

const playgroundSchema = new mongoose.Schema({
  sports: { type: String, require: true, lowercase: true },
  name: { type: String, require: true, lowercase: true },
  address: {
    province: { type: String, require: true, trim: true, match: korReg },
    city: { type: String, require: true, trim: true, match: korReg },
    district: { type: String, require: true, trim: true, match: korReg },
    town: { type: String, require: true, trim: true, match: korReg },
    detail: { type: String, require: true },
  },
  contact: { type: String, unique: true, require: true },
  position: {
    latitude: { type: Number, required: true, min: -90, max: 90 },
    longitude: { type: Number, required: true, min: -180, max: 180 },
  },
});

module.exports = mongoose.model("Playground", playgroundSchema);
