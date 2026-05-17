import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';
import { sendError } from '../utils/response.util';
import { User } from '../models/User.model';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      sendError(res, 'Access denied. No token provided.', 401);
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    // Verify user still exists and is active
    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.isActive) {
      sendError(res, 'User not found or deactivated.', 401);
      return;
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    };

    next();
  } catch (err) {
    const error = err as Error;
    if (error.name === 'JsonWebTokenError') {
      sendError(res, 'Invalid token.', 401);
      return;
    }
    if (error.name === 'TokenExpiredError') {
      sendError(res, 'Token expired. Please login again.', 401);
      return;
    }
    sendError(res, 'Authentication failed.', 401);
  }
};
