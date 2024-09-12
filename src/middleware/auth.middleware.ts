import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import Role from '../models/admin/role.model';

type AuthenticatedRequest = Request & {
  user?: JwtPayload;
};

export const authenticate = (roles: string[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Authentication token is required' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
      req.user = decoded;

      console.log('Decoded Token:', decoded);
      console.log('Required Roles:', roles);
      console.log('User Role:', decoded.role);

      const userRole = await Role.findById(decoded.role);

      if (!userRole) {
        return res.status(403).json({
          message: 'User role not found',
          success: false,
        });
      }

      if (!roles.includes(userRole.name)) {
        return res.status(403).json({
          message: 'Access denied. Insufficient permissions.',
          success: false,
        });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };
};
