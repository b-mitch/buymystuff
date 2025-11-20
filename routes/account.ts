import { Elysia } from 'elysia';
import db from '../db/index';
import bcrypt from 'bcrypt';
import validator from 'validator';
import authenticateToken from '../utils/auth';
import decodeJWT from '../utils/decodeJWT';
import { User } from '../types';

const passwordHasher = async (password: string, saltRounds: number): Promise<string | null> => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch(err){
    console.log(err);
  }
  return null;
};

// Email validation function
const isEmail = (email: string): boolean => {
  return validator.isEmail(email);
};

// Password validation function
const isValidPassword = (password: string): boolean => {
  return password.length >= 5 && password.length <= 20;
};

const accountRouter = new Elysia({ prefix: '/account' })
  // GET account details - requires authentication
  .get('/', async ({ headers, set }) => {
    try {
      authenticateToken(headers);
      const token = headers.authorization;
      const username = decodeJWT(token as string);
      
      const results = await db.query<User>('SELECT * FROM users WHERE username = $1', [username]);
      set.status = 200;
      return results.rows[0];
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        set.status = 401;
        return { error: true, message: 'Unauthorized' };
      }
      if (error.message === 'Forbidden') {
        set.status = 403;
        return { error: true, message: 'Forbidden' };
      }
      console.log('error');
      throw error;
    }
  })
  // PUT update account details
  .put('/details', async ({ body, headers, set }) => {
    const token = headers.authorization;
    const user = decodeJWT(token as string);
    const selectObject = await db.query<User>('SELECT id FROM users WHERE username = $1', [user]);
    const id = selectObject.rows[0].id;

    let { first, last, email, username, address, city, state, zip } = body as any;

    // Validate email if provided
    if (email && !isEmail(email)) {
      set.status = 422;
      return { errors: [{ field: 'email', message: 'Invalid email format' }] };
    }

    let results: any;
    try {
      if (first) {
        first = validator.escape(first);
        results = await db.query('update users set first_name = $1 where id = $2 RETURNING first_name', [first, id]);
      }
      if (last) {
        last = validator.escape(last);
        results = await db.query('update users set last_name = $1 where id = $2 RETURNING last_name', [last, id]);
      }
      if (email) {
        email = validator.escape(email);
        results = await db.query('update users set email = $1 where id = $2 RETURNING email', [email, id]);
      }
      if (username) {
        username = validator.escape(username);
        results = await db.query('update users set username = $1 where id = $2 RETURNING username', [username, id]);
      }
      if (address) {
        address = validator.escape(address);
        results = await db.query('update users set address = $1 where id = $2 RETURNING address', [address, id]);
      }
      if (city) {
        city = validator.escape(city);
        results = await db.query('update users set city = $1 where id = $2 RETURNING city', [city, id]);
      }
      if (state) {
        state = validator.escape(state);
        results = await db.query('update users set state = $1 where id = $2 RETURNING state', [state, id]);
      }
      if (zip) {
        zip = validator.escape(zip);
        results = await db.query('update users set zip = $1 where id = $2 RETURNING zip', [zip, id]);
      }
      set.status = 200;
      return results.rows[0];
    } catch (err: any) {
      return err.stack;
    }
  })
  // PUT update password
  .put('/password', async ({ body, headers, set }) => {
    const { currentPassword, password } = body as any;

    // Validate password length
    if (!isValidPassword(password)) {
      set.status = 422;
      return { errors: [{ field: 'password', message: 'Password must be between 5 and 20 characters' }] };
    }

    const token = headers.authorization;
    const username = decodeJWT(token as string);
    const selectObject = await db.query<User>('SELECT * FROM users WHERE username = $1', [username]);
    const user = selectObject.rows[0];

    const matchedPassword = await bcrypt.compare(currentPassword, user.password);
    if (!matchedPassword) {
      console.log("Password did not match!");
      set.status = 400;
      return { error: true, message: "Invalid current password" };
    }

    if (password) {
      const updateText = 'update users set password = $1 where username = $2';
      const hashedPassword = await passwordHasher(password, 10);
      const values = [hashedPassword, username];
      
      try {
        await db.query(updateText, values);
        set.status = 200;
        return { error: false, message: "Password updated successfully" };
      } catch (error) {
        console.log('error');
        throw error;
      }
    }
  });

export default accountRouter;
