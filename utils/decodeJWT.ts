import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { JWTPayload } from '../types';

dotenv.config();

const decodeJWT = (token: string): string => {
  const user = jwt.verify(token, process.env.TOKEN_SECRET as string) as JWTPayload;
  return user.username;
};

export default decodeJWT;