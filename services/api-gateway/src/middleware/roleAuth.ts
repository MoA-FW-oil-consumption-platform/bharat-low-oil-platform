import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to check if user has required role
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = req.user?.role || 'consumer';

    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({
        error: 'Forbidden',
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}`,
      });
      return;
    }

    next();
  };
};

/**
 * Middleware to check if user is admin
 */
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const userRole = req.user?.role;

  if (userRole !== 'admin') {
    res.status(403).json({
      error: 'Forbidden',
      message: 'Admin access required',
    });
    return;
  }

  next();
};

/**
 * Middleware to check if user is restaurant owner
 */
export const requireRestaurantOwner = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const userRole = req.user?.role;

  if (userRole !== 'restaurant_owner' && userRole !== 'admin') {
    res.status(403).json({
      error: 'Forbidden',
      message: 'Restaurant owner access required',
    });
    return;
  }

  next();
};

/**
 * Middleware to check if user is institutional manager
 */
export const requireInstitutionalManager = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const userRole = req.user?.role;

  if (userRole !== 'institutional_manager' && userRole !== 'admin') {
    res.status(403).json({
      error: 'Forbidden',
      message: 'Institutional manager access required',
    });
    return;
  }

  next();
};
