const express = require('express');
const db = require('../db/index');
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");

const helper = require('../helpers');

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

registerRouter.post('/', async (req, res, next) => {
  const { first, last, email, username, password } = req.body;
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
      const insertText = 'INSERT INTO users (first_name, last_name, email, username, password)VALUES($1, $2, $3, $4, $5) RETURNING *';
      const hashedPassword = await passwordHasher(password, 10);
      const values = await [first, last, email, username, hashedPassword];
      await db.query(insertText, values, (error, results) => {
        if (error) {
        console.log('error')
        throw error
        }
        res.status(200).json(results.rows[0])
      }) 
    })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = registerRouter;