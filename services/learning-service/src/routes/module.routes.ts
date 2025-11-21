import { Router } from 'express';
import {
  getModules,
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
  getModuleStats
} from '../controllers/module.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getModules);
router.get('/stats', authenticateToken, getModuleStats);
router.get('/:id', authenticateToken, getModuleById);
router.post('/', authenticateToken, requireAdmin, createModule);
router.put('/:id', authenticateToken, requireAdmin, updateModule);
router.delete('/:id', authenticateToken, requireAdmin, deleteModule);

export default router;
