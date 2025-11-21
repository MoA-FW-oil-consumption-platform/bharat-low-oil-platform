import { Request, Response } from 'express';
import Reward from '../models/Reward.model';

// Points configuration
const POINT_RULES = {
  dailyLog: 10,
  weekStreak: 50,
  monthlyGoal: 200,
  quizCompletion: 30,
  recipeShare: 20,
  lowOilWeek: 100
};

// Badge definitions
const BADGES = {
  healthyStart: {
    id: 'healthy-start',
    name: 'Healthy Start',
    description: 'Complete 7-day streak',
    icon: '🌟',
    condition: (reward: any) => reward.currentStreak >= 7
  },
  oilSaver: {
    id: 'oil-saver',
    name: 'Oil Saver',
    description: 'Reduce oil consumption by 20%',
    icon: '💚',
    condition: (reward: any) => reward.achievements.includes('20_percent_reduction')
  },
  familyChampion: {
    id: 'family-champion',
    name: 'Family Champion',
    description: 'All family members active',
    icon: '👨‍👩‍👧‍👦',
    condition: (reward: any) => reward.achievements.includes('family_active')
  },
  weeklyWarrior: {
    id: 'weekly-warrior',
    name: 'Weekly Warrior',
    description: 'Log daily for 1 week',
    icon: '⚔️',
    condition: (reward: any) => reward.currentStreak >= 7
  },
  monthlyMaster: {
    id: 'monthly-master',
    name: 'Monthly Master',
    description: 'Log daily for 30 days',
    icon: '👑',
    condition: (reward: any) => reward.currentStreak >= 30
  }
};

export const getRewards = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    let reward = await Reward.findOne({ userId });

    if (!reward) {
      reward = new Reward({ userId });
      await reward.save();
    }

    res.json({ reward });
  } catch (error) {
    console.error('Get rewards error:', error);
    res.status(500).json({ error: 'Failed to get rewards' });
  }
};

export const addPoints = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { reason, customPoints } = req.body;

    let reward = await Reward.findOne({ userId });

    if (!reward) {
      reward = new Reward({ userId });
    }

    const points = customPoints || POINT_RULES[reason as keyof typeof POINT_RULES] || 0;

    reward.totalPoints += points;
    reward.pointsHistory.push({
      points,
      reason: reason || 'manual',
      date: new Date()
    });

    await reward.save();

    // Check for new badges
    await checkAndAwardBadges(reward);

    res.json({
      message: 'Points added successfully',
      pointsAdded: points,
      totalPoints: reward.totalPoints
    });
  } catch (error) {
    console.error('Add points error:', error);
    res.status(500).json({ error: 'Failed to add points' });
  }
};

export const updateStreak = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { logDate } = req.body;

    let reward = await Reward.findOne({ userId });

    if (!reward) {
      reward = new Reward({ userId });
    }

    const currentDate = logDate ? new Date(logDate) : new Date();
    
    if (reward.lastLogDate) {
      const daysDiff = Math.floor(
        (currentDate.getTime() - reward.lastLogDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === 1) {
        // Consecutive day
        reward.currentStreak += 1;
        if (reward.currentStreak > reward.longestStreak) {
          reward.longestStreak = reward.currentStreak;
        }

        // Award streak points
        if (reward.currentStreak % 7 === 0) {
          reward.totalPoints += POINT_RULES.weekStreak;
          reward.pointsHistory.push({
            points: POINT_RULES.weekStreak,
            reason: 'week_streak',
            date: currentDate
          });
        }
      } else if (daysDiff > 1) {
        // Streak broken
        reward.currentStreak = 1;
      }
      // Same day - no change
    } else {
      // First log
      reward.currentStreak = 1;
    }

    reward.lastLogDate = currentDate;
    await reward.save();

    // Check for new badges
    await checkAndAwardBadges(reward);

    res.json({
      message: 'Streak updated successfully',
      currentStreak: reward.currentStreak,
      longestStreak: reward.longestStreak
    });
  } catch (error) {
    console.error('Update streak error:', error);
    res.status(500).json({ error: 'Failed to update streak' });
  }
};

export const awardBadge = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { badgeId } = req.body;

    let reward = await Reward.findOne({ userId });

    if (!reward) {
      reward = new Reward({ userId });
    }

    const badge = BADGES[badgeId as keyof typeof BADGES];
    
    if (!badge) {
      res.status(400).json({ error: 'Invalid badge ID' });
      return;
    }

    // Check if badge already earned
    const alreadyHas = reward.badges.some(b => b.id === badge.id);
    
    if (alreadyHas) {
      res.status(400).json({ error: 'Badge already earned' });
      return;
    }

    reward.badges.push({
      id: badge.id,
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      earnedAt: new Date()
    });

    await reward.save();

    res.json({
      message: 'Badge awarded successfully',
      badge: reward.badges[reward.badges.length - 1]
    });
  } catch (error) {
    console.error('Award badge error:', error);
    res.status(500).json({ error: 'Failed to award badge' });
  }
};

async function checkAndAwardBadges(reward: any): Promise<void> {
  try {
    const existingBadgeIds = reward.badges.map((b: any) => b.id);

    for (const [_key, badge] of Object.entries(BADGES)) {
      if (!existingBadgeIds.includes(badge.id) && badge.condition(reward)) {
        reward.badges.push({
          id: badge.id,
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
          earnedAt: new Date()
        });
      }
    }

    await reward.save();
  } catch (error) {
    console.error('Error checking badges:', error);
  }
}
