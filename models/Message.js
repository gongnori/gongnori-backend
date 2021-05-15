const mongoose = require("mongoose");

const emailReg = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

const messageSchema = new mongoose.Schema({
  chats: [{ type: String }]
});

module.exports = mongoose.model("Message", messageSchema);
