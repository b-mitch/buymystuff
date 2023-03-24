const express = require('express');
const db = require('../db/index');
const bodyParser = require('body-parser');
const decodeJWT = require('../utils/decodeJWT');
const stripe = require("stripe")('sk_test_51MpCyhDoFFCpZ0bnGFzsp5fR5mWc7Zi6wN5HadQs99Iwwi6VGCHbZQJD4FPqNk6QrI8cQzxUl1XfMXIU5Q5KyuBa00Cgy3yrXJ');

const checkoutRouter = express.Router();

checkoutRouter.use(bodyParser.json());
checkoutRouter.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const calculateOrderAmount = async (userID) => {
  const results = await db.query('SELECT SUM(carts.amount*products.price) AS total FROM carts, products WHERE user_id = $1 AND products.id=carts.product_id', [userID]);
  const total = (Number(results.rows[0].total.slice(1)).toFixed(2))*100;
  console.log(total);
  return total;
};

checkoutRouter.get('/', async (req, res) => {
  const userId = req.session.user.id;
  const results = await db.query('SELECT * FROM carts WHERE user_id = $1', [userId]);
  const cart = results.rows;
  const totalObject = await db.query('SELECT SUM(product_amount*product_price) AS total FROM carts WHERE user_id = $1', [userId]);
  const total = totalObject.rows[0];
  cart.push(total);
  res.status(200).send(cart);
});

checkoutRouter.put('/', async (req, res) => {
  const userId = req.session.user.id;
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
  const userId = req.session.user.id
  const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const select = await db.query('SELECT product_id, product_price, product_amount FROM carts WHERE user_id = $1', [userId]);
  const products = select.rows;

  const selectOrders = await db.query('SELECT COUNT(*) FROM orders');
  const totalOrders = Number(selectOrders.rows[0].count);
  const id = totalOrders+1;

  let order = [];
  for (const item of products) {
    const results = await db.query('INSERT INTO orders (id, user_id, date, product_id, product_price, product_amount) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [id, userId, date, item.product_id, item.product_price, item.product_amount]);
    order.push(results.rows[0]);
    } 
  res.status(200).send(order);
})

checkoutRouter.delete('/', (req, res) => {
  const userId = req.session.user.id;
  db.query('DELETE FROM carts WHERE user_id = $1', [userId], (error, results) => {
    if (error) {
    console.log('error')
    throw error
    }
    res.status(204).send('product deleted from cart');
  })
})

checkoutRouter.post("/create-payment-intent", async (req, res) => {
  console.log("STRIPING")
  const token = req.headers.authorization;
  const user = decodeJWT(token); 
  const selectObject =  await db.query('SELECT id FROM users WHERE username = $1', [user]);
  const userID = selectObject.rows[0].id;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: await calculateOrderAmount(userID),
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});


module.exports = checkoutRouter;