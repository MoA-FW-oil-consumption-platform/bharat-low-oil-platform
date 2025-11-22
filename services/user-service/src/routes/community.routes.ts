import { Router } from 'express';
import {
  getLeaderboard,
  getUserCommunityStats,
  updateStreak
} from '../controllers/community.controller';

const router = Router();

router.get('/leaderboard', getLeaderboard);
router.get('/stats/:userId', getUserCommunityStats);
router.post('/streak/:userId', updateStreak);

export default router;
