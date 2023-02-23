const express = require('express');
const db = require('../db/index');
const bodyParser = require('body-parser');

const checkoutRouter = express.Router();

checkoutRouter.use(bodyParser.json());
checkoutRouter.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

checkoutRouter.get('/', async (req, res) => {
  const userId = 1;
  const results = await db.query('SELECT * FROM carts WHERE user_id = $1', [userId]);
  const cart = results.rows;
  const totalObject = await db.query('SELECT SUM(product_amount*product_price) AS total FROM carts WHERE user_id = $1', [userId]);
  const total = totalObject.rows[0];
  cart.push(total);
  res.status(200).send(cart);
});

checkoutRouter.put('/', async (req, res) => {
  const userId = 1
  const select = await db.query('SELECT product_id, product_amount FROM carts WHERE user_id = $1', [userId]);
  const productsArray = select.rows;
  let updatedProducts = [];
  for (const item of productsArray) {
    const results = await db.query('UPDATE products SET inventory = inventory - $1 WHERE id = $2 RETURNING *', [item.product_amount, item.product_id])
    updatedProducts.push(results.rows[0])
    };
  res.status(200).send(updatedProducts);
})

checkoutRouter.post('/', async (req, res) => {
  const userId = 1
  const date = Date.now();
  const select = await db.query('SELECT product_id, product_price, product_amount FROM carts WHERE user_id = $1', [userId]);
  const products = select.rows;
  let order = [];
  for (const item of products) {
    const results = await db.query('INSERT INTO orders (user_id, date, product_id, product_price, product_amount) VALUES ($1, to_timestamp($2), $3, $4, $5) RETURNING *', [userId, date, item.product_id, item.product_price, item.product_amount]);
    order.push(results.rows[0]);
    } 
  res.status(200).send(order);
})



module.exports = checkoutRouter;