import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types/auth.types';
import { sendError } from '../utils/response.util';

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Authentication required.', 401);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendError(
        res,
        `Access denied. Required role(s): ${allowedRoles.join(', ')}. Your role: ${req.user.role}`,
        403
      );
      return;
    }

    next();
  };
};

export const isAdmin = authorize('admin');
export const isAdminOrSales = authorize('admin', 'sales');
