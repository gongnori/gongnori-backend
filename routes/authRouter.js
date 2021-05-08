const express = require("express");
const router = express.Router();

router.get("/login", (req, res, next) => {
  // console.log(req.body);
  res.status(200).send("!!!");
});

router.post("/login", (req, res, next) => {
  console.log(req.body);
  res.status(200).send("!!!");
});

module.exports = router;
