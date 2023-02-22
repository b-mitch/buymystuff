const express = require('express');
const db = require('../db/index');
const bodyParser = require('body-parser');

const cartRouter = express.Router();

cartRouter.use(bodyParser.json());
cartRouter.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

cartRouter.get('/', async (req, res) => {
  const userId = 1;
  const results = await db.query('SELECT * FROM carts WHERE user_id = $1', [userId]);
  const cart = results.rows;
  const totalObject = await db.query('SELECT SUM(product_amount*product_price) AS total FROM carts WHERE user_id = $1', [userId]);
  const total = totalObject.rows[0];
  cart.push(total);
  res.status(200).send(cart);
});

cartRouter.put('/', (req, res) => {
  const userId = 1;
  const productId = 3;
  const amount = req.body.amount;

  db.query('UPDATE carts SET product_amount = $3 WHERE user_id = $2 AND product_id = $1 RETURNING *', [productId, userId, amount], (error, results) => {
    if (error) {
    console.log('error')
    throw error
    }
    res.status(200).json(results.rows[0])
  })
})

cartRouter.delete('/', (req, res) => {
  const userId = 1;
  const productId = 3;

  db.query('DELETE FROM carts WHERE user_id = $1 AND product_id = $2', [userId, productId], (error, results) => {
    if (error) {
    console.log('error')
    throw error
    }
    res.status(204).send('product deleted from cart');
  })
})

module.exports = cartRouter;