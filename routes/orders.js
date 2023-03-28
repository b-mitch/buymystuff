const express = require('express');
const db = require('../db/index');
const bodyParser = require('body-parser');
const decodeJWT = require('../utils/decodeJWT');

const ordersRouter = express.Router();

ordersRouter.use(bodyParser.json());
ordersRouter.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

ordersRouter.get('/', async (req, res) => {
  const token = req.headers.authorization;
  const user = decodeJWT(token); 
  const selectObject =  await db.query('SELECT id FROM users WHERE username = $1', [user]);
  const userID = selectObject.rows[0].id;
  const results = await db.query('SELECT orders.id, orders.date, SUM(products_orders.amount*products_orders.price) AS total FROM orders, products_orders WHERE user_id = $1 AND orders.id=products_orders.order_id GROUP BY orders.id, orders.date;', [userID]);
  res.status(200).send(results.rows);
});

ordersRouter.get('/:id', async (req, res) => {
  const id = req.params.id;
  const token = req.headers.authorization;
  const user = decodeJWT(token); 
  const selectObject =  await db.query('SELECT id FROM users WHERE username = $1', [user]);
  const userID = selectObject.rows[0].id;
  const results = await db.query('SELECT orders.id, orders.date, products.name, products_orders.amount, products_orders.price FROM orders, products, products_orders WHERE user_id = $1 AND orders.id = $2 AND orders.id=products_orders.order_id AND products_orders.product_id=products.id;', [userID, id]);
  res.status(200).send(results.rows);
});

module.exports = ordersRouter;