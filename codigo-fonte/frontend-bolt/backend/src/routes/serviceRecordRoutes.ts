import { Router } from 'express';
import {
  createServiceRecord,
  getServiceRecords,
  getServiceRecordById,
  updateServiceRecord,
  deleteServiceRecord,
  getServiceRecordStats
} from '../controllers/serviceRecordController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Aplicar autenticação a todas as rotas
router.use(authenticateToken);

// Rotas de registros de atendimento
router.post('/', createServiceRecord);
router.get('/stats', getServiceRecordStats);
router.get('/', getServiceRecords);
router.get('/:id', getServiceRecordById);
router.put('/:id', updateServiceRecord);
router.delete('/:id', deleteServiceRecord);

export default router;