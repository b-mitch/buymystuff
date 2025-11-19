import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { JWTPayload } from '../types';

dotenv.config();

const generateAccessToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, process.env.TOKEN_SECRET as string, { expiresIn: "24h" });
};

export default generateAccessToken;