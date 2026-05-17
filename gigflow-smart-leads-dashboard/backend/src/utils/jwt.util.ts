import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { IUserPayload } from '../types/auth.types';

export const signToken = (payload: IUserPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): IUserPayload => {
  return jwt.verify(token, env.JWT_SECRET) as IUserPayload;
};

export const decodeToken = (token: string): IUserPayload | null => {
  const decoded = jwt.decode(token);
  if (!decoded || typeof decoded === 'string') return null;
  return decoded as IUserPayload;
};
