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
  const orders = results.rows;
  console.log(orders);
  const totalObject = await db.query('SELECT date, SUM(product_amount*product_price) AS total FROM orders WHERE user_id = $1 GROUP BY date', [userId]);
  const orderTotals = totalObject.rows
  console.log(orderTotals);
  res.status(200).send(orders);
});

module.exports = ordersRouter;