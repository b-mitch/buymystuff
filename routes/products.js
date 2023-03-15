const express = require('express');
const db = require('../db/index');
const bodyParser = require('body-parser');

const productsRouter = express.Router();

productsRouter.use(bodyParser.json());
productsRouter.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

productsRouter.get('/', (req, res) => {
  const category = req.query.category;
  if(category){
    res.redirect('/products/filter/' + category);
    return;
  }
  db.query('SELECT * FROM products', (error, results) => {
    if (error) {
      console.log('error')
      throw error
    }
    res.status(200).json(results.rows)
  })
});

productsRouter.post('/', async (req, res) => {
  const selectObject = await db.query('SELECT COUNT(*) FROM products');
  const totalProducts = Number(selectObject.rows[0].count);
  const id = totalProducts+1;

  const { name, category, price, inventory } = req.body;
  const text = 'INSERT INTO products (id, name, category, price, inventory)VALUES($1, $2, $3, $4, $5) RETURNING *';
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
  console.log(req.params)
  const name = req.params.product;
  console.log(name)
  db.query('SELECT * FROM products WHERE name = $1', [name], (error, results) => {
    if (error) {
    console.log('error')
    throw error
    }
    res.status(200).json(results.rows[0])
  })
})

productsRouter.post('/:id', async (req, res) => {
  const productId = req.params.id;
  const userId = 1;
  const amount = req.body.amount;
  const product = await db.query('select * from products where id = $1', [productId]);
  const price = product.rows[0].price;

  await db.query('INSERT INTO carts (user_id, product_id, product_price, product_amount)VALUES($1, $2, $3, $4) RETURNING *', [userId, productId, price, amount], (error, results) => {
    if (error) {
    console.log('error')
    throw error
    }
    res.status(200).json(results.rows[0])
  })
})


module.exports = productsRouter;