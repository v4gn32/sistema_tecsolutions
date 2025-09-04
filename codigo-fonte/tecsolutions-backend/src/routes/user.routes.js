// src/routes/user.routes.js
// Rotas de administração de usuários (somente ADMIN)

import { Router } from 'express';
import authenticate from '../middlewares/auth.middleware.js';
import { onlyRoles } from '../middlewares/role.middleware.js';
import { listUsers, createUser, updateUser, deleteUser } from '../controllers/user.controller.js';

const router = Router();

router.use(authenticate, onlyRoles('ADMIN')); // todas abaixo exigem ADMIN

router.get('/', listUsers);          // GET /api/users
router.post('/', createUser);        // POST /api/users
router.put('/:id', updateUser);      // PUT /api/users/:id
router.delete('/:id', deleteUser);   // DELETE /api/users/:id

export default router;
