import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { cookie } from '@elysiajs/cookie';
import { jwt } from '@elysiajs/jwt';
import dotenv from 'dotenv';

import db from './db/index';
import { User } from './types';

// Import route handlers (to be created)
import registerRoutes from './routes-elysia/registration';
import loginRoutes from './routes-elysia/login';
import productsRoutes from './routes-elysia/products';
import accountRoutes from './routes-elysia/account';
import cartRoutes from './routes-elysia/cart';
import checkoutRoutes from './routes-elysia/checkout';
import ordersRoutes from './routes-elysia/orders';

dotenv.config();

const PORT = process.env.PORT || 4000;
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'default-secret-key-for-development';

// Create Elysia app
const app = new Elysia()
  // CORS middleware
  .use(cors({
    origin: true,
    credentials: true,
  }))
  // Cookie support
  .use(cookie())
  // JWT support for authentication
  .use(jwt({
    name: 'jwt',
    secret: TOKEN_SECRET,
  }))
  // Logger middleware - simple request logging similar to Morgan
  .onRequest((context) => {
    const { request } = context;
    console.log(`${request.method} ${new URL(request.url).pathname}`);
  })
  // Session store - using in-memory store similar to express-session
  .decorate('sessionStore', new Map<string, any>())
  // Helper to get/set session
  .derive((context) => ({
    getSession: (sessionId: string) => {
      return context.sessionStore.get(sessionId);
    },
    setSession: (sessionId: string, data: any) => {
      context.sessionStore.set(sessionId, data);
    },
    destroySession: (sessionId: string) => {
      context.sessionStore.delete(sessionId);
    },
  }))
  // Register routes
  .use(registerRoutes)
  .use(loginRoutes)
  .use(productsRoutes)
  .use(accountRoutes)
  .use(cartRoutes)
  .use(checkoutRoutes)
  .use(ordersRoutes)
  // Home route
  .get('/home', () => {
    return 'This is the home page';
  })
  // Root route - get all users
  .get('/', async () => {
    try {
      const results = await db.query<User>('SELECT * FROM users');
      console.log(results.rows);
      return results.rows;
    } catch (error) {
      console.log('error');
      throw error;
    }
  })
  // Logout route
  .get('/logout', (context) => {
    const sessionId = context.cookie.sessionId;
    if (sessionId) {
      context.destroySession(sessionId);
    }
    // Elysia redirect
    context.set.redirect = '/';
    return;
  })
  // Error handler
  .onError((context) => {
    const { error, code } = context;
    console.error('Error:', error);
    
    if (code === 'NOT_FOUND') {
      return { error: true, message: 'Not Found' };
    }
    
    return { 
      error: true, 
      message: error.message || 'Internal Server Error' 
    };
  })
  .listen(PORT);

console.log(`Server listening on port ${PORT}`);
console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);

export default app;
