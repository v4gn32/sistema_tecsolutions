import { Router } from 'express';
import {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
  toggleClientStatus,
  getClientProposals,
  getClientServiceRecords
} from '../controllers/clientController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Todas as rotas de cliente requerem autenticação
router.use(authenticateToken);

// Rotas CRUD
router.post('/', createClient);                           // POST /api/clients - Criar cliente
router.get('/', getClients);                              // GET /api/clients - Listar clientes
router.get('/:id', getClientById);                        // GET /api/clients/:id - Buscar cliente por ID
router.put('/:id', updateClient);                         // PUT /api/clients/:id - Atualizar cliente
router.delete('/:id', deleteClient);                      // DELETE /api/clients/:id - Deletar cliente
router.patch('/:id/toggle-status', toggleClientStatus);   // PATCH /api/clients/:id/toggle-status - Ativar/Desativar cliente

// Rotas relacionadas
router.get('/:id/proposals', getClientProposals);         // GET /api/clients/:id/proposals - Propostas do cliente
router.get('/:id/service-records', getClientServiceRecords); // GET /api/clients/:id/service-records - Atendimentos do cliente

export default router;