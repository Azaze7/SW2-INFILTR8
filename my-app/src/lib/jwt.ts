// src/lib/jwt.ts
//module to handle JWT token creation and verification.
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET || '';

export function signToken(payload: object): string {
  return jwt.sign(payload, secret, { expiresIn: '1h' });
}

export function verifyToken(token: string): object | null {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    console.error('Invalid token:', err);
    return null;
  }
}
