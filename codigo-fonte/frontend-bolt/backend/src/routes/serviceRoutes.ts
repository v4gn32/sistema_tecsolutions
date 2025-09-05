import { Router } from 'express';
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  toggleServiceStatus,
  getServiceCategories
} from '../controllers/serviceController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Todas as rotas de serviço requerem autenticação
router.use(authenticateToken);

// Rotas CRUD
router.post('/', createService);                          // POST /api/services - Criar serviço
router.get('/', getServices);                             // GET /api/services - Listar serviços
router.get('/categories', getServiceCategories);         // GET /api/services/categories - Listar categorias
router.get('/:id', getServiceById);                      // GET /api/services/:id - Buscar serviço por ID
router.put('/:id', updateService);                       // PUT /api/services/:id - Atualizar serviço
router.delete('/:id', deleteService);                    // DELETE /api/services/:id - Deletar serviço
router.patch('/:id/toggle-status', toggleServiceStatus); // PATCH /api/services/:id/toggle-status - Ativar/Desativar serviço

export default router;