const express = require('express');
const db = require('../db/index');
const bodyParser = require('body-parser');
const decodeJWT = require('../utils/decodeJWT');


const cartRouter = express.Router();

cartRouter.use(bodyParser.json());
cartRouter.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

cartRouter.get('/total', async(req, res) => {
  const token = req.headers.authorization;
  const user = decodeJWT(token); 
  const selectObject =  await db.query('SELECT id FROM users WHERE username = $1', [user]);
  const userID = selectObject.rows[0].id;
  const results = await db.query('SELECT SUM(carts.product_amount*products.price) AS total FROM carts, products WHERE user_id = $1 AND products.id=carts.product_id', [userID]);
  const total = results.rows[0].total.slice(1);
  res.status(200).send(total);
})

cartRouter.get('/', async(req, res) => {
  const token = req.headers.authorization;
  const user = decodeJWT(token); 
  const selectObject =  await db.query('SELECT id FROM users WHERE username = $1', [user]);
  const userID = selectObject.rows[0].id;
  const results = await db.query('SELECT carts.id, carts.product_amount AS amount, products.name FROM carts, products WHERE user_id = $1 AND products.id=carts.product_id;', [userID]);
  res.status(200).send(results.rows);
});

cartRouter.put('/:id', (req, res) => {
  const id = req.params.id;
  const amount = Number(req.body.amount);
  db.query('UPDATE carts SET product_amount = $2 WHERE id = $1 RETURNING *', [id, amount], (error, results) => {
    if (error) {
    console.log('error')
    throw error
    }
    res.status(200).json(results.rows[0])
  })
})

cartRouter.delete('/:id', (req, res) => {
  const id = req.params.id

  db.query('DELETE FROM carts WHERE id = $1', [id], (error, results) => {
    if (error) {
    console.log('error')
    throw error
    }
    res.status(200).send();
  })
})

module.exports = cartRouter;