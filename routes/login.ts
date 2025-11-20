import { Elysia } from 'elysia';
import db from '../db/index';
import bcrypt from 'bcrypt';
import validator from 'validator';
import generateToken from '../utils/generateToken';
import { User } from '../types';

// Password validation function
const isValidPassword = (password: string): boolean => {
  return password.length <= 20;
};

const loginRouter = new Elysia({ prefix: '/login' })
  .post('/', async (context) => {
    const { body, set, cookie } = context;
    const { username, password } = body as any;
    // @ts-ignore - setSession is added via derive in app.ts
    const setSession = (context as any).setSession;

    // Check for required fields
    if (!username || !password) {
      set.status = 400;
      return { error: true, message: "Missing username or password" };
    }

    // Validate password length
    if (!isValidPassword(password)) {
      set.status = 422;
      return { errors: [{ field: 'password', message: 'Password too long' }] };
    }

    const sanitizedUsername = validator.escape(username);
    const sanitizedPassword = validator.escape(password);
    
    const selectText = 'SELECT * FROM users WHERE username = $1';
    const values = [sanitizedUsername];
    
    try {
      const results = await db.query<User>(selectText, values);
      const user = results.rows[0];
      
      if (!user) {
        console.log("User does not exist!");
        set.status = 400;
        return { error: true, message: "User does not exist" };
      }
      
      const id = user.id;
      const matchedPassword = await bcrypt.compare(sanitizedPassword, user.password);
      
      if (!matchedPassword) {
        console.log("Password did not match!");
        set.status = 400;
        return { error: true, message: "Invalid password" };
      }
      
      console.log('Password matches!');
      
      // Create session ID and store session data
      const sessionId = Math.random().toString(36).substring(7);
      cookie.sessionId.set({
        value: sessionId,
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        path: "/",
        maxAge: 86400000 / 1000, // Convert to seconds for cookie
      });
      
      setSession(sessionId, {
        authenticated: true,
        user: {
          id,
          username: sanitizedUsername,
          password: sanitizedPassword,
        },
      });
      
      const token = generateToken({ username: sanitizedUsername });
      set.status = 200;
      return { error: false, token, message: "Logged in sucessfully" };
    } catch (err: any) {
      set.status = 500;
      return { message: err.message };
    }
  });

export default loginRouter;
