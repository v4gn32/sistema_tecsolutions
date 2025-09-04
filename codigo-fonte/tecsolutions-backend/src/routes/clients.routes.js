// src/routes/clients.routes.js
// Rotas de clientes (técnicos e admins autenticados)

import { Router } from 'express';
import authenticate from '../middlewares/auth.middleware.js';
import { list, create, update, remove, getById } from '../controllers/clients.controller.js';

const router = Router();

router.use(authenticate); // exige login

router.get('/', list);          // GET /api/clients
router.get('/:id', getById);    // GET /api/clients/:id
router.post('/', create);       // POST /api/clients
router.put('/:id', update);     // PUT /api/clients/:id
router.delete('/:id', remove);  // DELETE /api/clients/:id

export default router;
