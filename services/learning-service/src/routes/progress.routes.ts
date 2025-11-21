import { Router } from 'express';
import {
  startModule,
  updateProgress,
  submitQuiz,
  getUserProgress,
  getProgressStats
} from '../controllers/progress.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/:moduleId/start', authenticateToken, startModule);
router.put('/:moduleId', authenticateToken, updateProgress);
router.post('/:moduleId/quiz', authenticateToken, submitQuiz);
router.get('/', authenticateToken, getUserProgress);
router.get('/stats', authenticateToken, getProgressStats);

export default router;
