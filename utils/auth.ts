import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import { JWTPayload } from '../types';

dotenv.config();

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers['authorization'];

  if (token == null) {
    res.sendStatus(401);
    return;
  }

  jwt.verify(token, process.env.TOKEN_SECRET as string, (err, user) => {
    if (err) {
      res.sendStatus(403);
      return;
    }

    req.user = user as JWTPayload;
    next();
  });
};

export default authenticateToken;