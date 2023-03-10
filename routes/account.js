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
  const id = req.session.user.id;  
  let { first, last, email, username } = req.body;
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
  const id = req.session.user.id;
  const password = validator.escape(req.body.password);
  if(password) {
  const updateText = 'update users set password = $1 where id = $2 RETURNING *'
  const hashedPassword = await passwordHasher(password, 10);
  const values = await [hashedPassword, id];
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