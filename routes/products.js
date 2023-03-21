const express = require('express');
const db = require('../db/index');
const bodyParser = require('body-parser');
const decodeJWT = require('../utils/decodeJWT');
const { v4: uuidv4 } = require('uuid');

const productsRouter = express.Router();

productsRouter.use(bodyParser.json());
productsRouter.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

productsRouter.get('/', (req, res) => {
  db.query('SELECT * FROM products', (error, results) => {
    if (error) {
      console.log('error')
      throw error
    }
    res.status(200).json(results.rows)
  })
});

productsRouter.post('/', async (req, res) => {

  const id = uuidv4();

  const { name, category, price, inventory } = req.body;
  const text = 'INSERT INTO products (id, name, category, price, inventory) VALUES($1, $2, $3, $4, $5) RETURNING *';
  const values = [id, name, category, price, inventory];
  db.query(text, values, (error, results) => {
    if (error) {
    console.log('error')
    throw error
    }
    res.status(200).json(results.rows[0])
  });
})

productsRouter.get('/c/:category', (req, res) => {
  const category = req.params.category;
  db.query('SELECT * FROM products WHERE category = $1', [category], (error, results) => {
    if (error) {
    console.log('error')
    throw error
    }
    res.status(200).json(results.rows)
  })
})

productsRouter.get('/:product', (req, res) => {
  const name = req.params.product;
  db.query('SELECT * FROM products WHERE name = $1', [name], (error, results) => {
    if (error) {
    console.log('error')
    throw error
    }
    res.status(200).json(results.rows[0])
  })
})

productsRouter.get('/:product/price', (req, res) => {
  const name = req.params.product;
  db.query('SELECT price FROM products WHERE name = $1', [name], (error, results) => {
    if (error) {
    console.log('error')
    throw error
    }
    const price = results.rows[0].price.slice(1);
    res.status(200).json(price);
  })
})

productsRouter.post('/:name', async (req, res) => {
  const name = req.params.name;
  const amount = req.body.amount;
  console.log(name)

  const token = req.headers.authorization;
  const user = decodeJWT(token); 
  const selectObject =  await db.query('SELECT id FROM users WHERE username = $1', [user]);
  const userID = selectObject.rows[0].id;

  const product = await db.query('select * from products where name = $1', [name]);
  const productID = product.rows[0].id;

  const productInCart = await db.query('select * from carts where product_id = $1', [productID])

  if(productInCart.rows[0]) {
    console.log('product in cart')
    await db.query('UPDATE carts SET amount = amount + $1 WHERE product_id = $2 RETURNING *', [amount, productID], (error, results) => {
      if (error) {
      console.log('error')
      throw error
    }
    res.status(200).json(results.rows)
    })
  }

  if(!productInCart.rows[0]) {
    console.log('product not in cart')

    const id = uuidv4();

    await db.query('INSERT INTO carts (id, user_id, product_id, amount)VALUES($1, $2, $3, $4) RETURNING *', [id, userID, productID, amount], (error, results) => {
      if (error) {
      console.log('error')
      throw error
      }
      res.status(200).json(results.rows[0])
    })
  }
})


module.exports = productsRouter;