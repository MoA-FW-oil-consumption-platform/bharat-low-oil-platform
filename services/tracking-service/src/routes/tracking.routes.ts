import { Router } from 'express';
import {
  createLog,
  getLogs,
  getMonthlyUsage,
  deleteLog
} from '../controllers/tracking.controller';

const router = Router();

router.post('/logs', createLog);
router.get('/logs/:userId', getLogs);
router.get('/usage/:userId/monthly', getMonthlyUsage);
router.delete('/logs/:logId', deleteLog);

export default router;
