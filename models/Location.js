const mongoose = require("mongoose");

const korReg = /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*$/;

const locationSchema = new mongoose.Schema({
  province: { type: String, require: true, trim: true, match: korReg },
  city: { type: String, require: true, trim: true, match: korReg },
  district: { type: String, require: true, trim: true, match: korReg },
  position: {
    latitude: { type: Number, required: false, min: -90, max: 90 },
    longitude: { type: Number, required: false, min: -180, max: 180 },
  },
});

module.exports = mongoose.model("Location", locationSchema);
