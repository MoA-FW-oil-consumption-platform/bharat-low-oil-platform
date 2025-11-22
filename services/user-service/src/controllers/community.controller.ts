import { Request, Response } from 'express';
import User from '../models/User.model';

/**
 * Get global leaderboard based on points
 */
export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    
    const leaderboard = await User.find({})
      .sort({ points: -1 })
      .limit(limit)
      .select('userId fullName points streak region');

    res.json({
      leaderboard: leaderboard.map((u, index) => ({
        rank: index + 1,
        userId: u.userId, // In production, maybe mask this
        name: u.fullName,
        points: u.points,
        streak: u.streak,
        region: u.region
      }))
    });
  } catch (error: any) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
};

/**
 * Get user's community stats
 */
export const getUserCommunityStats = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate rank
    const rank = await User.countDocuments({ points: { $gt: user.points || 0 } }) + 1;

    res.json({
      userId,
      points: user.points || 0,
      streak: user.streak || 0,
      globalRank: rank,
      badges: [
        // Mock badges for now
        { id: 'early_adopter', name: 'Early Adopter', icon: '🌟' },
        { id: 'oil_saver', name: 'Oil Saver', icon: '💧' }
      ]
    });
  } catch (error: any) {
    console.error('Get community stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
};

/**
 * Update user streak (Internal/Admin use or triggered by tracking service)
 */
export const updateStreak = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { increment } = req.body;

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (increment) {
      user.streak = (user.streak || 0) + 1;
      user.points = (user.points || 0) + 10; // 10 points per streak day
    } else {
      user.streak = 0;
    }

    await user.save();

    res.json({
      message: 'Streak updated',
      streak: user.streak,
      points: user.points
    });
  } catch (error: any) {
    console.error('Update streak error:', error);
    res.status(500).json({ error: 'Failed to update streak' });
  }
};
