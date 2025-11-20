import { Elysia } from 'elysia';
import db from '../db/index';
import decodeJWT from '../utils/decodeJWT';
import { User, CartItem, UpdateCartItemRequest } from '../types';

const cartRouter = new Elysia({ prefix: '/cart' })
  // GET cart total
  .get('/total', async ({ headers, set }) => {
    const token = headers.authorization;
    const user = decodeJWT(token as string);
    const selectObject = await db.query<User>('SELECT id FROM users WHERE username = $1', [user]);
    const userID = selectObject.rows[0].id;
    const results = await db.query<{ total: string }>('SELECT SUM(carts.amount*products.price) AS total FROM carts, products WHERE user_id = $1 AND products.id=carts.product_id', [userID]);
    
    if (!results.rows[0].total) return;
    const total = results.rows[0].total.slice(1);
    set.status = 200;
    return total;
  })
  // GET cart items
  .get('/', async ({ headers, set }) => {
    const token = headers.authorization;
    const user = decodeJWT(token as string);
    const selectObject = await db.query<User>('SELECT id FROM users WHERE username = $1', [user]);
    const userID = selectObject.rows[0].id;
    const results = await db.query<{ id: string; amount: number; name: string }>('SELECT carts.id, carts.amount, products.name FROM carts, products WHERE user_id = $1 AND products.id=carts.product_id;', [userID]);
    set.status = 200;
    return results.rows;
  })
  // PUT update cart item amount
  .put('/:id', async ({ params, body, set }) => {
    const { id } = params;
    const { amount } = body as UpdateCartItemRequest;
    const numAmount = Number(amount);
    
    try {
      const results = await db.query<CartItem>('UPDATE carts SET amount = $2 WHERE id = $1 RETURNING *', [id, numAmount]);
      set.status = 200;
      return results.rows[0];
    } catch (error) {
      console.log('error');
      throw error;
    }
  })
  // DELETE cart item
  .delete('/:id', async ({ params, set }) => {
    const { id } = params;
    
    try {
      await db.query('DELETE FROM carts WHERE id = $1', [id]);
      set.status = 200;
      return;
    } catch (error) {
      console.log('error');
      throw error;
    }
  });

export default cartRouter;
