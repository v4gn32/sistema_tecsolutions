import { Router } from 'express';
import {
  createProposal,
  getProposals,
  getProposalById,
  updateProposal,
  deleteProposal,
  updateProposalStatus,
  duplicateProposal,
  getProposalStats
} from '../controllers/proposalController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Aplicar autenticação a todas as rotas
router.use(authenticateToken);

// Rotas de propostas
router.post('/', createProposal);
router.get('/', getProposals);
router.get('/stats', getProposalStats);
router.get('/:id', getProposalById);
router.put('/:id', updateProposal);
router.delete('/:id', deleteProposal);
router.patch('/:id/status', updateProposalStatus);
router.post('/:id/duplicate', duplicateProposal);

export default router;