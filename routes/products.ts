import { Elysia } from 'elysia';
import db from '../db/index';
import decodeJWT from '../utils/decodeJWT';
import { v4 as uuidv4 } from 'uuid';
import { Product, CartItem, User } from '../types';

const productsRoutes = new Elysia({ prefix: '/products' })
  // GET all products
  .get('/', async ({ set }) => {
    try {
      const results = await db.query<Product>('SELECT * FROM products');
      set.status = 200;
      return results.rows;
    } catch (error) {
      console.log('error');
      throw error;
    }
  })
  // POST new product
  .post('/', async ({ body, set }) => {
    const { name, category, price, inventory } = body as any;
    const id = uuidv4();
    const text = 'INSERT INTO products (id, name, category, price, inventory) VALUES($1, $2, $3, $4, $5) RETURNING *';
    const values = [id, name, category, price, inventory];
    
    try {
      const results = await db.query<Product>(text, values);
      set.status = 200;
      return results.rows[0];
    } catch (error) {
      console.log('error');
      throw error;
    }
  })
  // GET products by category
  .get('/c/:category', async ({ params, set }) => {
    const { category } = params;
    
    try {
      const results = await db.query<Product>('SELECT * FROM products WHERE category = $1', [category]);
      set.status = 200;
      return results.rows;
    } catch (error) {
      console.log('error');
      throw error;
    }
  })
  // GET product by name
  .get('/:product', async ({ params, set }) => {
    const { product: name } = params;
    
    try {
      const results = await db.query<Product>('SELECT * FROM products WHERE name = $1', [name]);
      if (!results.rows[0]) {
        set.status = 400;
        return { error: true, message: "Product does not exist" };
      }
      set.status = 200;
      return results.rows[0];
    } catch (error) {
      console.log('error');
      throw error;
    }
  })
  // GET product price
  .get('/:product/price', async ({ params, set }) => {
    const { product: name } = params;
    
    try {
      const results = await db.query<{ price: string }>('SELECT price FROM products WHERE name = $1', [name]);
      const price = results.rows[0].price.slice(1);
      set.status = 200;
      return price;
    } catch (error) {
      console.log('error');
      throw error;
    }
  })
  // POST add product to cart
  .post('/:product', async ({ params, body, headers, set }) => {
    const { product: name } = params;
    const { amount } = body as any;
    
    let userID: string | undefined;
    const token = headers.authorization;
    
    if (token) {
      const user = decodeJWT(token);
      const selectObject = await db.query<User>('SELECT id FROM users WHERE username = $1', [user]);
      userID = selectObject.rows[0].id;
    }
    
    const product = await db.query<Product>('select * from products where name = $1', [name]);
    const productID = product.rows[0].id;
    
    const productInCart = await db.query<CartItem>('select * from carts where product_id = $1 AND user_id = $2', [productID, userID]);
    
    if (token && productInCart.rows[0]) {
      try {
        const results = await db.query<CartItem>('UPDATE carts SET amount = amount + $1 WHERE product_id = $2 RETURNING *', [amount, productID]);
        set.status = 200;
        return results.rows;
      } catch (error) {
        console.log('error');
        throw error;
      }
    }
    
    if (token) {
      const id = uuidv4();
      
      try {
        const results = await db.query<CartItem>('INSERT INTO carts (id, user_id, product_id, amount)VALUES($1, $2, $3, $4) RETURNING *', [id, userID, productID, amount]);
        set.status = 200;
        return results.rows[0];
      } catch (error) {
        console.log('error');
        throw error;
      }
    }
    
    const id = uuidv4();
    
    try {
      const results = await db.query<CartItem>('INSERT INTO carts (id, product_id, amount)VALUES($1, $2, $3) RETURNING *', [id, productID, amount]);
      set.status = 200;
      return results.rows[0].id;
    } catch (error) {
      console.log('error');
      throw error;
    }
  });

export default productsRoutes;
