const jwt = require('jsonwebtoken');
require("dotenv").config();

const decodeJWT = (token) => {
  const user = jwt.verify(token, process.env.TOKEN_SECRET);
  return user.username;
}

module.exports = decodeJWT;