const createError = require("http-errors");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const { createMessage, getMyMessages } = require("../models/controllers/messageController");

router.get("/my", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const { email } = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

    const data = await getMyMessages(email);

    res.status(200).json({
      message: "success",
      data,
      error: null,
    });
  } catch (err) {
    console.log(`GET : /message/my - ${err}`);
    next(createError(500, "Internal Server Error"));
  }
});

router.post("/", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const { email } = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

    await createMessage({ email, ...req.body });

    res.status(200).json({
      message: "success",
      data: null,
      error: null,
    });
  } catch (err) {
    console.log(`POST : /message - ${err}`);
    next(createError(500, "Internal Server Error"));
  }
});

module.exports = router;
