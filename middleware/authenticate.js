const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    jwt.verify(token, process.env.TOKEN_SECRET_KEY);

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authenticate;
