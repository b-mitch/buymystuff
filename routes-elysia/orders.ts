import { Elysia } from 'elysia';
import db from '../db/index';
import decodeJWT from '../utils/decodeJWT';
import { User } from '../types';

const ordersRoutes = new Elysia({ prefix: '/orders' })
  // GET all orders for user
  .get('/', async ({ headers, set }) => {
    const token = headers.authorization;
    const user = decodeJWT(token as string);
    const selectObject = await db.query<User>('SELECT id FROM users WHERE username = $1', [user]);
    const userID = selectObject.rows[0].id;
    const results = await db.query<{ id: string; date: string; total: string }>('SELECT orders.id, orders.date, SUM(products_orders.amount*products_orders.price) AS total FROM orders, products_orders WHERE user_id = $1 AND orders.id=products_orders.order_id GROUP BY orders.id, orders.date;', [userID]);
    set.status = 200;
    return results.rows;
  })
  // GET order details by ID
  .get('/:id', async ({ params, headers, set }) => {
    const { id } = params;
    const token = headers.authorization;
    const user = decodeJWT(token as string);
    const selectObject = await db.query<User>('SELECT id FROM users WHERE username = $1', [user]);
    const userID = selectObject.rows[0].id;
    const results = await db.query<{ id: string; date: string; name: string; amount: number; price: string }>('SELECT orders.id, orders.date, products.name, products_orders.amount, products_orders.price FROM orders, products, products_orders WHERE user_id = $1 AND orders.id = $2 AND orders.id=products_orders.order_id AND products_orders.product_id=products.id;', [userID, id]);
    set.status = 200;
    return results.rows;
  });

export default ordersRoutes;
