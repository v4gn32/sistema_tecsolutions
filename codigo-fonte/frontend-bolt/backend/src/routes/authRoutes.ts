import { Router } from 'express';
import { login, register, getCurrentUser, logout, validateToken } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Rotas públicas
router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);

// Rotas protegidas
router.get('/me', authenticateToken, getCurrentUser);
router.get('/validate', authenticateToken, validateToken);

export default router;