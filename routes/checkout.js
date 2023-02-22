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

checkoutRouter.get('/', (req, res) => {
  const cartId = 1;
  db.query('SELECT * FROM products_carts WHERE cart_id = $1', [cartId], (error, results) => {
    if (error) {
    console.log('error')
    throw error
    }
    res.status(200).json(results.rows)
  })
});

checkoutRouter.post('/', (req, res) => {
  const productIds = [1, 2]
  const orderId = 1
  const text = 'INSERT INTO orders (product, category, price, inventory)VALUES($1, $2, $3, $4) RETURNING *';
  const values = [name, category, price, inventory];
  db.query(text, values, (error, results) => {
    if (error) {
    console.log('error')
    throw error
    }
    res.status(200).json(results.rows[0])
  });
})



module.exports = checkoutRouter;