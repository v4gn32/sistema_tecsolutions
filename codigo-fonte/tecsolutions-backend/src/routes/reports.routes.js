// src/routes/reports.routes.js
import { Router } from 'express';
import auth from '../middlewares/auth.middleware.js';
import { listReports, createReport, deleteReport } from '../controllers/reports.controller.js';

const router = Router();
router.use(auth);

router.get('/', listReports);
router.post('/', createReport);
router.delete('/:id', deleteReport);

export default router;
