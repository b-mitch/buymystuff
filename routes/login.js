const express = require('express');
const db = require('../db/index');
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const validator = require('validator');
const { check, validationResult } = require('express-validator');
const generateToken = require('../utils/generateToken');

const loginRouter = express.Router();

loginRouter.use(bodyParser.json());
loginRouter.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

loginRouter.post("/", [check('password').isLength({ max: 20 })], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
  return res.status(422).json({ errors: errors.array() });
  }
  const username = validator.escape(req.body.username);
  const password = validator.escape(req.body.password);
  const selectText = 'SELECT * FROM users WHERE username = $1'
  const values = [username];
  try {
    const results = await db.query(selectText, values);
    const user = await results.rows[0];
    const id = user.id;
    if (!user) {
      console.log("User does not exist!");
      return res.status(400).send({ error: true, message: "User does not exist"});
    }
    const matchedPassword = await bcrypt.compare(password, user.password);
    if (!matchedPassword) {
      console.log("Password did not match!");
      return res.status(400).send({ error: true, message: "Invalid password"});
    }
    console.log('Password matches!');
    req.session.authenticated = true;
    req.session.user = {
      id,
      username,
      password
    }
    const token = generateToken({ username: req.session.user.username })
    return res.status(200).send({ error: false, token, message: "Logged in sucessfully" })
    } catch (err) {
        res.status(500).json({ message: err.message });
      }
});

module.exports = loginRouter;