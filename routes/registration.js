const express = require('express');
const db = require('../db/index');
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const validator = require('validator');
const { check, validationResult } = require('express-validator');
const generateToken = require('../utils/generateToken');

const registerRouter = express.Router();

registerRouter.use(bodyParser.json());
registerRouter.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const passwordHasher = async (password, saltRounds) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch(err){
    console.log(err);
  }
  return null;
}

registerRouter.post('/', [
  check('password').isLength({ max: 20, min: 5 }),
  check('email').isEmail()], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
  return res.status(422).json({ errors: errors.array() });
  }

  const selectObject = await db.query('SELECT COUNT(*) FROM users');
  const totalUsers = Number(selectObject.rows[0].count);
  const id = totalUsers+1;

  const first = validator.escape(req.body.first); 
  const last = validator.escape(req.body.last); 
  const email = validator.escape(req.body.email); 
  const username = validator.escape(req.body.username); 
  const password = validator.escape(req.body.password);

  try {
    const selectText = 'SELECT * FROM users WHERE username = $1'
    const values = [username];
    await db.query(selectText, values, async (error, results) => {
      if (error) {
        console.log('error')
        throw error
        }
      const user = results.rows[0];
      if (user) {
        console.log("User already exists!");
        return res.redirect("login");
      }
      const insertText = 'INSERT INTO users (id, first_name, last_name, email, username, password)VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
      const hashedPassword = await passwordHasher(password, 10);
      const values = await [id, first, last, email, username, hashedPassword];
      let newUser = await db.query(insertText, values)
      let newUsername = await newUser.rows[0].username;
      const token = generateToken({ username: newUsername })
      console.log(token)
      return res.status(200).send({ error: false, token, message: "User created" })
      }) 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = registerRouter;