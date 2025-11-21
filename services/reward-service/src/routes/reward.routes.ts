import { Router } from 'express';
import {
  getRewards,
  addPoints,
  updateStreak,
  awardBadge
} from '../controllers/reward.controller';

const router = Router();

router.get('/:userId', getRewards);
router.post('/:userId/points', addPoints);
router.post('/:userId/streak', updateStreak);
router.post('/:userId/badge', awardBadge);

export default router;
