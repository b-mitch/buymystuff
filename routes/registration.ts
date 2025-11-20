import { Elysia, t } from 'elysia';
import db from '../db/index';
import bcrypt from 'bcrypt';
import validator from 'validator';
import generateToken from '../utils/generateToken';
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

const registerRouter = new Elysia({ prefix: '/register' })
  .post('/', async ({ body, set }) => {
    // Type the body
    const { first, last, email, username, password } = body as any;

    // Validate required fields
    if (!first || !last || !email || !username || !password) {
      set.status = 400;
      return { error: true, message: "Missing one or more required fields" };
    }

    // Validate email format
    if (!isEmail(email)) {
      set.status = 422;
      return { errors: [{ field: 'email', message: 'Invalid email format' }] };
    }

    // Validate password length
    if (!isValidPassword(password)) {
      set.status = 422;
      return { errors: [{ field: 'password', message: 'Password must be between 5 and 20 characters' }] };
    }

    // Sanitize inputs
    const sanitizedFirst = validator.escape(first);
    const sanitizedLast = validator.escape(last);
    const sanitizedEmail = validator.escape(email);
    const sanitizedUsername = validator.escape(username);
    const sanitizedPassword = validator.escape(password);

    // Check if email exists
    const emailExistsResult = await db.query<User>('SELECT * FROM users WHERE email = $1', [sanitizedEmail]);
    const emailExists = emailExistsResult.rows;
    if (emailExists?.length) {
      console.log("email already exists!");
      set.status = 400;
      return { error: true, message: "The provided email is linked to an existing account." };
    }

    try {
      // Check if username exists
      const selectText = 'SELECT * FROM users WHERE username = $1';
      const values = [sanitizedUsername];
      const results = await db.query<User>(selectText, values);
      const user = results.rows[0];
      
      if (user) {
        console.log("User already exists!");
        set.status = 400;
        return { error: true, message: "Username already exists. Please choose another username" };
      }

      // Get total users to generate new ID
      const selectObject = await db.query<{ count: string }>('SELECT COUNT(*) FROM users');
      const totalUsers = Number(selectObject.rows[0].count);
      const id = totalUsers + 1;

      // Hash password and insert user
      const insertText = 'INSERT INTO users (id, first_name, last_name, email, username, password)VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
      const hashedPassword = await passwordHasher(sanitizedPassword, 10);
      const insertValues = [id, sanitizedFirst, sanitizedLast, sanitizedEmail, sanitizedUsername, hashedPassword];
      const newUser = await db.query<User>(insertText, insertValues);
      const newUsername = newUser.rows[0].username;
      const token = generateToken({ username: newUsername });
      
      set.status = 200;
      return { error: false, token, message: "User created" };
    } catch (err: any) {
      set.status = 500;
      return { message: err.message };
    }
  });

export default registerRouter;
