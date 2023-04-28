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

  let first = req.body.first; 
  let last = req.body.last; 
  let email = req.body.email; 
  let username = req.body.username; 
  let password = req.body.password;

  if (!first || !last || !email || !username || !password) {
    return res.status(400).send({ error: true, message: "Missing one or more required fields"});
  }

  first = validator.escape(first); 
  last = validator.escape(last); 
  email = validator.escape(email); 
  username = validator.escape(username); 
  password = validator.escape(password);

  let emailExists = await db.query('SELECT * FROM users WHERE email = $1', [email]) 
  emailExists = emailExists.rows
  if (emailExists?.length) {
    console.log("email already exists!");
    return res.status(400).send({ error: true, message: "The provided email is linked to an existing account."});
  }

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
        return res.status(400).send({ error: true, message: "Username already exists. Please choose another username"});
      }
      const insertText = 'INSERT INTO users (id, first_name, last_name, email, username, password)VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
      const hashedPassword = await passwordHasher(password, 10);
      const values = await [id, first, last, email, username, hashedPassword];
      let newUser = await db.query(insertText, values)
      let newUsername = await newUser.rows[0].username;
      const token = generateToken({ username: newUsername })
      return res.status(200).send({ error: false, token, message: "User created" })
      }) 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = registerRouter;