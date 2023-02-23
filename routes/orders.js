const express = require('express');
const db = require('../db/index');
const bodyParser = require('body-parser');

const ordersRouter = express.Router();

ordersRouter.use(bodyParser.json());
ordersRouter.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

ordersRouter.get('/', async (req, res) => {
  const userId = req.session.user.id;
  const results = await db.query('SELECT * FROM orders WHERE user_id = $1', [userId]);
  const cart = results.rows;
  const totalObject = await db.query('SELECT SUM(product_amount*product_price) AS total FROM carts WHERE user_id = $1', [userId]);
  const total = totalObject.rows[0];
  cart.push(total);
  res.status(200).send(cart);
});

module.exports = ordersRouter;