import { Router } from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus
} from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Todas as rotas de usuário requerem autenticação
router.use(authenticateToken);

// Rotas CRUD
router.post('/', createUser);                    // POST /api/users - Criar usuário
router.get('/', getUsers);                       // GET /api/users - Listar usuários
router.get('/:id', getUserById);                 // GET /api/users/:id - Buscar usuário por ID
router.put('/:id', updateUser);                  // PUT /api/users/:id - Atualizar usuário
router.delete('/:id', deleteUser);               // DELETE /api/users/:id - Deletar usuário
router.patch('/:id/toggle-status', toggleUserStatus); // PATCH /api/users/:id/toggle-status - Ativar/Desativar usuário

export default router;