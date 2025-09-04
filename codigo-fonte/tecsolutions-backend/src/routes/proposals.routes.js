// src/routes/proposals.routes.js
import { Router } from 'express';
import auth from '../middlewares/auth.middleware.js';
import { listProposals, getProposal, createProposal, updateProposalStatus, deleteProposal } from '../controllers/proposals.controller.js';

const router = Router();
router.use(auth);

router.get('/', listProposals);
router.get('/:id', getProposal);
router.post('/', createProposal);
router.patch('/:id/status', updateProposalStatus);
router.delete('/:id', deleteProposal);

export default router;
