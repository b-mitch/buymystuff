const express = require('express');
const db = require('../db/index');
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const validator = require('validator');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
let token = jwt.sign({ foo: 'bar' }, 'shhhhh');

const loginRouter = express.Router();

loginRouter.use(bodyParser.json());
loginRouter.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

loginRouter.get("/", (req, res) => {

})

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
      return res.status(400);
    }
    console.log('Password matches!');
    req.session.authenticated = true;
    req.session.user = {
      id,
      username,
      password
    }
    token = jwt.sign(
      {
        id: req.session.user.id,
        username: req.session.user.username,
        type: 'user',
      },
      process.env.SECRET,
      { expiresIn: '24h' }
    );
    return res.status(201).send({ token })
    } catch (err) {
        res.status(500).json({ message: err.message });
      }
});

module.exports = loginRouter;