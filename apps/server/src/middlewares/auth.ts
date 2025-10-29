import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../db/models/index.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    roles: string[];
  };
  params: any;
  body: any;
  query: any;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ error: 'Требуется авторизация' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      roles: string[];
    };

    // Проверяем, что пользователь существует
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Пользователь не найден' });
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      roles: decoded.roles,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Токен истек' });
    }
    return res.status(401).json({ error: 'Неверный токен' });
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.roles.includes('admin')) {
    return res.status(403).json({ error: 'Требуются права администратора' });
  }
  next();
};

