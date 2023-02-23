const express = require('express');
const db = require('../db/index');
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");


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

accountRouter.get('/', (req, res) => {
  const id = req.session.user.id;
  db.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
    console.log('error')
    throw error
    }
    res.status(200).json(results.rows[0])
  })
})

accountRouter.put('/details', async (req, res) => {
  const id = req.session.user.id;  
  const { first, last, email, username } = req.body;
  let results;
  try {
    if(first) {
    results = await db.query('update users set first_name = $1 where id = $2 RETURNING *', [first, id]);
  }
    if(last) {
      results = await db.query('update users set last_name = $1 where id = $2 RETURNING *', [last, id]);
    }
    if(email) {
      results = await db.query('update users set email = $1 where id = $2 RETURNING *', [email, id]);
    }
    if(username) {
      results = await db.query('update users set username = $1 where id = $2 RETURNING *', [username, id]);
    }
    await res.status(200).json(results.rows[0])
  } catch (err) {
    return err.stack;
  }
})

accountRouter.put('/password', async (req, res) => {
  const id = req.session.user.id;
  const { password } = req.body;
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