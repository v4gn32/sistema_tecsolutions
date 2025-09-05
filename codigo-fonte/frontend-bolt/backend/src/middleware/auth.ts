import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AuthPayload } from '../types/index';

// Estender o tipo Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ 
      success: false, 
      error: 'Token de acesso requerido' 
    });
    return;
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ 
      success: false, 
      error: 'Token inválido ou expirado' 
    });
    return;
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ 
      success: false, 
      error: 'Usuário não autenticado' 
    });
    return;
  }

  if (req.user.role !== 'ADMIN') {
    res.status(403).json({ 
      success: false, 
      error: 'Acesso negado. Apenas administradores podem acessar este recurso.' 
    });
    return;
  }

  next();
};

export const requireAuth = authenticateToken;