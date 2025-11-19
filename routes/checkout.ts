import express, { Request, Response } from 'express';
import db from '../db/index';
import bodyParser from 'body-parser';
import decodeJWT from '../utils/decodeJWT';
import Stripe from 'stripe';
import { User, Order, Product } from '../types';

const stripe = new Stripe('sk_test_51MpCyhDoFFCpZ0bnGFzsp5fR5mWc7Zi6wN5HadQs99Iwwi6VGCHbZQJD4FPqNk6QrI8cQzxUl1XfMXIU5Q5KyuBa00Cgy3yrXJ', {
  apiVersion: '2022-11-15',
});

const checkoutRouter = express.Router();

checkoutRouter.use(bodyParser.json());
checkoutRouter.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const calculateOrderTotal = async (userID: string): Promise<number> => {
  const results = await db.query<{ total: string }>('SELECT SUM(carts.amount*products.price) AS total FROM carts, products WHERE user_id = $1 AND products.id=carts.product_id', [userID]);
  const total = Number(Number(results.rows[0].total.slice(1)).toFixed(2)) * 100;
  return total;
};

const nologinTotal = async (idArray: string[]): Promise<number> => {
  const totalArray: number[] = [];
  for (const item of idArray){
    const results = await db.query<{ total: string }>('SELECT SUM(carts.amount*products.price) AS total FROM carts, products WHERE carts.id = $1 AND products.id=carts.product_id', [item]);
    const itemTotal = Number(Number(results.rows[0].total.slice(1)).toFixed(2)) * 100;
    totalArray.push(itemTotal);
  }

  const total = totalArray.reduce((x, y) => x + y);
  return total;
};


checkoutRouter.put('/', async (req: Request, res: Response) => {
  // Get products
  const token = req.headers.authorization;
  let userID: string | undefined;
  let products: Array<{ product_id: string; amount: number }> = [];
  if(token !== '1') {
    const user = decodeJWT(token as string); 
    const selectObject = await db.query<User>('SELECT id FROM users WHERE username = $1', [user]);
    userID = selectObject.rows[0].id;
    const results = await db.query<{ product_id: string; amount: number }>('SELECT product_id, amount FROM carts WHERE user_id = $1', [userID]);
    products = results.rows;
  } else {
    const idArray = req.body.idArray;
    for (const item of idArray){
      const results = await db.query<{ product_id: string; amount: number }>('SELECT product_id, amount FROM carts WHERE carts.id = $1', [item]);
      products.push(results.rows[0]);
    }
  }

  // Update products
  const updatedProducts: Product[] = [];
  for (const item of products) {
    const results = await db.query<Product>('UPDATE products SET inventory = inventory - $1 WHERE id = $2 RETURNING *', [item.amount, item.product_id]);
    updatedProducts.push(results.rows[0]);
  }
  res.status(200).send(updatedProducts);
});

checkoutRouter.post('/', async (req: Request, res: Response) => {
  // Add to orders
  const { first, last, email, address, city, state, zip } = req.body;

  const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  
  const id = "id" + Math.random().toString(16).slice(2);

  const token = req.headers.authorization;
  let userID: string | undefined;
  if(token !== '1'){
    const user = decodeJWT(token as string); 
    const selectObject = await db.query<User>('SELECT id FROM users WHERE username = $1', [user]);
    userID = selectObject.rows[0].id;

    await db.query<Order>('INSERT INTO orders (id, date, user_id, first_name, last_name, email, address, city, state, zip) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *', [id, date, userID, first, last, email, address, city, state, zip]);
  } else {
    await db.query<Order>('INSERT INTO orders (id, date, first_name, last_name, email, address, city, state, zip) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [id, date, first, last, email, address, city, state, zip]);
  }

  // Add to products-orders 
  let products: Array<{ id: string; price: string; amount: number }> = [];
  if(token !== '1') {
    const results = await db.query<{ id: string; price: string; amount: number }>('SELECT products.id, products.price, carts.amount FROM carts, products WHERE user_id = $1 AND products.id=carts.product_id', [userID]);
    products = results.rows;
  } else {
    const idArray = req.body.idArray;
    console.log(idArray);
    for (const item of idArray){
      const results = await db.query<{ id: string; price: string; amount: number }>('SELECT products.id, products.price, carts.amount FROM carts, products WHERE carts.id = $1 AND products.id=carts.product_id', [item]);
      products.push(results.rows[0]);
    }
  }

  for (const item of products) {
    await db.query('INSERT INTO products_orders (order_id, product_id, amount, price) VALUES ($1, $2, $3, $4) RETURNING *', [id, item.id, item.amount, item.price]);
  } 
  res.status(200).send({id: id});
});

checkoutRouter.delete('/', async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  let userID: string | undefined;
  if(token !== '1') {
    const user = decodeJWT(token as string); 
    const selectObject = await db.query<User>('SELECT id FROM users WHERE username = $1', [user]);
    userID = selectObject.rows[0].id;
    await db.query('DELETE FROM carts WHERE user_id = $1', [userID]);
    return res.status(200).send({ error: false, message: "Items deleted from user cart" });
  }
  return res.status(200).send({ error: false, message: "no-login carts deleted from database" });
});

checkoutRouter.post("/create-payment-intent", async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  let userID: string | undefined;
  if(token !== '1'){
    const user = decodeJWT(token as string); 
    const selectObject = await db.query<User>('SELECT id FROM users WHERE username = $1', [user]);
    userID = selectObject.rows[0].id;
  }

  const idArray = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: userID ? await calculateOrderTotal(userID) : await nologinTotal(idArray),
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

export default checkoutRouter;