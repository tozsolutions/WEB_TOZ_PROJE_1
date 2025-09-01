import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User';
import { createError, asyncHandler } from './errorHandler';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticate = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check for token in cookies (if using cookie-based auth)
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(createError('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;

    // Find user by id
    const user = await User.findById(decoded.id).select('+password');
    
    if (!user) {
      return next(createError('No user found with this token', 401));
    }

    if (!user.isActive) {
      return next(createError('User account is deactivated', 401));
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    return next(createError('Not authorized to access this route', 401));
  }
});

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError('User not authenticated', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(createError(`User role '${req.user.role}' is not authorized to access this route`, 403));
    }

    next();
  };
};

export const optionalAuth = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
      const user = await User.findById(decoded.id);
      
      if (user && user.isActive) {
        req.user = user;
      }
    } catch (error) {
      // Token invalid, but that's ok for optional auth
    }
  }

  next();
});