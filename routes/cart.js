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

cartRouter.get('/', (req, res) => {
  const cartId = 1;
  db.query('SELECT * FROM products_carts WHERE cart_id = $1', [cartId], (error, results) => {
    if (error) {
    console.log('error')
    throw error
    }
    res.status(200).json(results.rows)
  })
});

cartRouter.put('/', (req, res) => {
  const cartId = 1;
  const productId = 3;
  const amount = req.body.amount;

  db.query('UPDATE products_carts SET amount = $3 WHERE cart_id = $2 AND product_id = $1 RETURNING *', [productId, cartId, amount], (error, results) => {
    if (error) {
    console.log('error')
    throw error
    }
    res.status(200).json(results.rows)
  })
})

cartRouter.delete('/', (req, res) => {
  const cartId = 1;
  const productId = 3;

  db.query('DELETE FROM products_carts WHERE cart_id = $2 AND product_id = $1', [productId, cartId], (error, results) => {
    if (error) {
    console.log('error')
    throw error
    }
    res.status(204).send('product deleted from car');
  })
})

module.exports = cartRouter;