const jwt = require('jsonwebtoken');
require("dotenv").config();

const generateAccessToken = (username) => {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: "24h" }
  );
}

module.exports = generateAccessToken;