const express = require('express');
const db = require('../db/index');
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const validator = require('validator');
const { check, validationResult } = require('express-validator');
const authenticateUser = require('../utils/auth')
const decodeJWT = require('../utils/decodeJWT');


const accountRouter = express.Router();

accountRouter.use(bodyParser.json());
accountRouter.use(
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

accountRouter.get('/', authenticateUser, (req, res) => {
  const token = req.headers.authorization;
  const username = decodeJWT(token);
  db.query('SELECT * FROM users WHERE username = $1', [username], (error, results) => {
    if (error) {
    console.log('error')
    throw error
    }
    res.status(200).json(results.rows[0])
  })
})

accountRouter.put('/details', [
  check('email').isEmail()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const token = req.headers.authorization;
  const user = decodeJWT(token); 
  const selectObject =  await db.query('SELECT id FROM users WHERE username = $1', [user]);
  const id = selectObject.rows[0].id;

  let { first, last, email, username, address, city, state, zip } = req.body;
  let results;
  try {
    if(first) {
    first = validator.escape(first); 
    results = await db.query('update users set first_name = $1 where id = $2 RETURNING *', [first, id]);
  }
    if(last) { 
      last = validator.escape(last); 
      results = await db.query('update users set last_name = $1 where id = $2 RETURNING *', [last, id]);
    }
    if(email) {
      email = validator.escape(email);
      results = await db.query('update users set email = $1 where id = $2 RETURNING *', [email, id]);
    }
    if(username) {
      username = validator.escape(username);
      results = await db.query('update users set username = $1 where id = $2 RETURNING *', [username, id]);
    }
    if(address) {
      address = validator.escape(address);
      results = await db.query('update users set address = $1 where id = $2 RETURNING *', [address, id]);
    }
    if(city) {
      city = validator.escape(city);
      results = await db.query('update users set city = $1 where id = $2 RETURNING *', [city, id]);
    }
    if(state) {
      state = validator.escape(state);
      results = await db.query('update users set state = $1 where id = $2 RETURNING *', [state, id]);
    }
    if(zip) {
      zip = validator.escape(zip);
      results = await db.query('update users set zip = $1 where id = $2 RETURNING *', [zip, id]);
    }
    await res.status(200).json(results.rows[0])
  } catch (err) {
    return err.stack;
  }
})

accountRouter.put('/password', [check('password').isLength({ max: 20, min: 5 })], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
  return res.status(422).json({ errors: errors.array() });
  }

  const token = req.headers.authorization;
  const username = decodeJWT(token); 
  const selectObject =  await db.query('SELECT * FROM users WHERE username = $1', [username]);
  const user = selectObject.rows[0];
  const currentPassword = req.body.currentPassword;
  const password = req.body.password;

  const matchedPassword = await bcrypt.compare(currentPassword, user.password);
  if (!matchedPassword) {
    console.log("Password did not match!");
    return res.status(400).send({ error: true, message: "Invalid password"});
  }

  if(password) {
  const updateText = 'update users set password = $1 where username = $2 RETURNING *'
  const hashedPassword = await passwordHasher(password, 10);
  const values = await [hashedPassword, username];
  await db.query(updateText, values, (error, results) => {
    if (error) {
    console.log('error')
    throw error
    }
    res.status(200).json(results.rows[0])
    }) 
  }
})


module.exports = accountRouter;