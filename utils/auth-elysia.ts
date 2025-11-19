import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { JWTPayload } from '../types';

dotenv.config();

// Elysia authentication middleware
export const authenticateToken = (headers: Record<string, string | undefined>) => {
  const token = headers['authorization'];

  if (token == null) {
    throw new Error('Unauthorized');
  }

  try {
    const user = jwt.verify(token, process.env.TOKEN_SECRET as string) as JWTPayload;
    return user;
  } catch (err) {
    throw new Error('Forbidden');
  }
};

export default authenticateToken;
