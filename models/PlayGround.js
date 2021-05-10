const mongoose = require("mongoose");
const korReg = /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*$/;

const playGroundSchema = new mongoose.Schema({
  sports: { type: String, require: true, lowercase: true },
  name: { type: String, require: true, lowercase: true },
  address: {
    province: { type: String, require: true, trim: true, match: korReg }, //한국어만
    city: { type: String, require: true, trim: true, match: korReg },
    district: { type: String, require: true, trim: true, match: korReg },
    town: { type: String, require: true, trim: true, match: korReg },
    detail: { type: String, require: true },
  },
  contact: { type: String, unique: true, require: true }, // 나중에 정규식 넣기...
  location: {
    latitude: { type: Number, required: true, min: -90, max: 90 },
    longitude: { type: Number, required: true, min: -180, max: 180 },
  },
});

module.exports = mongoose.model("PlayGround", playGroundSchema);
