import { Router } from 'express';
import {
  // Hardware
  createHardwareItem,
  getHardwareItems,
  getHardwareItemById,
  updateHardwareItem,
  deleteHardwareItem,
  // Software
  createSoftwareItem,
  getSoftwareItems,
  getSoftwareItemById,
  updateSoftwareItem,
  deleteSoftwareItem,
  updateSoftwareInstallations,
  // Stats
  getInventoryStats
} from '../controllers/inventoryController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Aplicar autenticação a todas as rotas
router.use(authenticateToken);

// Rotas de estatísticas
router.get('/stats', getInventoryStats);

// Rotas de hardware
router.post('/hardware', createHardwareItem);
router.get('/hardware', getHardwareItems);
router.get('/hardware/:id', getHardwareItemById);
router.put('/hardware/:id', updateHardwareItem);
router.delete('/hardware/:id', deleteHardwareItem);

// Rotas de software
router.post('/software', createSoftwareItem);
router.get('/software', getSoftwareItems);
router.get('/software/:id', getSoftwareItemById);
router.put('/software/:id', updateSoftwareItem);
router.delete('/software/:id', deleteSoftwareItem);
router.patch('/software/:id/installations', updateSoftwareInstallations);

export default router;