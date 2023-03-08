const express = require('express');
const db = require('../db/index');
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const validator = require('validator');
const { check, validationResult } = require('express-validator');

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
      return res.redirect("login");
    }
    const matchedPassword = await bcrypt.compare(password, user.password);
    if (!matchedPassword) {
      console.log("Password did not match!");
      return res.redirect("login");
    }
    console.log('Password matches!');
    req.session.authenticated = true;
    req.session.user = {
      id,
      username,
      password
    }
    res.redirect("/account")  
    } catch (err) {
        res.status(500).json({ message: err.message });
      }
});

module.exports = loginRouter;