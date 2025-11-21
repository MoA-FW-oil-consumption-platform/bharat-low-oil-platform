import { Response } from 'express';
import Joi from 'joi';
import UserProgress from '../models/UserProgress.model';
import Module from '../models/Module.model';
import Quiz from '../models/Quiz.model';
import { AuthRequest } from '../middleware/auth';

const updateProgressSchema = Joi.object({
  lessonId: Joi.string().optional(),
  videoWatchTime: Joi.number().min(0).optional(),
  status: Joi.string().valid('in_progress', 'quiz_required', 'completed').optional()
});

const submitQuizSchema = Joi.object({
  answers: Joi.array().items(
    Joi.object({
      questionIndex: Joi.number().required(),
      selectedOption: Joi.number().required()
    })
  ).required()
});

export const startModule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { moduleId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    // Verify module exists
    const module = await Module.findById(moduleId);
    if (!module) {
      res.status(404).json({ error: 'Module not found' });
      return;
    }

    if (!module.isPublished && req.user?.role !== 'admin') {
      res.status(403).json({ error: 'Module not available' });
      return;
    }

    // Check if progress already exists
    let progress = await UserProgress.findOne({ userId, moduleId });

    if (progress) {
      progress.lastAccessedAt = new Date();
      if (progress.status === 'not_started') {
        progress.status = 'in_progress';
      }
      await progress.save();
    } else {
      progress = new UserProgress({
        userId,
        moduleId,
        status: 'in_progress',
        startedAt: new Date(),
        lastAccessedAt: new Date()
      });
      await progress.save();
    }

    res.json({
      success: true,
      message: 'Module started successfully',
      data: progress
    });
  } catch (error) {
    console.error('Start module error:', error);
    res.status(500).json({ error: 'Failed to start module' });
  }
};

export const updateProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { moduleId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { error, value } = updateProgressSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const progress = await UserProgress.findOne({ userId, moduleId });

    if (!progress) {
      res.status(404).json({ error: 'Module progress not found. Please start the module first.' });
      return;
    }

    // Update lesson completion
    if (value.lessonId && !progress.lessonsCompleted.includes(value.lessonId)) {
      progress.lessonsCompleted.push(value.lessonId);
    }

    // Update video watch time
    if (value.videoWatchTime !== undefined) {
      progress.videoWatchTime += value.videoWatchTime;
    }

    // Update status
    if (value.status) {
      progress.status = value.status;
    }

    progress.lastAccessedAt = new Date();
    await progress.save();

    res.json({
      success: true,
      message: 'Progress updated successfully',
      data: progress
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
};

export const submitQuiz = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { moduleId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { error, value } = submitQuizSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const progress = await UserProgress.findOne({ userId, moduleId });
    if (!progress) {
      res.status(404).json({ error: 'Module progress not found' });
      return;
    }

    // Get module to find quiz
    const module = await Module.findById(moduleId);
    if (!module || !module.quizId) {
      res.status(404).json({ error: 'Quiz not found for this module' });
      return;
    }

    const quiz = await Quiz.findById(module.quizId);
    if (!quiz) {
      res.status(404).json({ error: 'Quiz not found' });
      return;
    }

    // Check attempt limit
    if (quiz.maxAttempts && progress.quizAttempts.length >= quiz.maxAttempts) {
      res.status(400).json({ error: 'Maximum quiz attempts reached' });
      return;
    }

    // Grade the quiz
    let totalPoints = 0;
    let earnedPoints = 0;
    const gradedAnswers = value.answers.map((answer: any) => {
      const question = quiz.questions[answer.questionIndex];
      if (!question) {
        return {
          questionIndex: answer.questionIndex,
          selectedOption: answer.selectedOption,
          isCorrect: false,
          pointsEarned: 0
        };
      }

      totalPoints += question.points;
      const isCorrect = question.correctAnswer === answer.selectedOption;
      const pointsEarned = isCorrect ? question.points : 0;
      earnedPoints += pointsEarned;

      return {
        questionIndex: answer.questionIndex,
        selectedOption: answer.selectedOption,
        isCorrect,
        pointsEarned
      };
    });

    const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    const passed = percentage >= quiz.passingScore;

    const attempt = {
      attemptNumber: progress.quizAttempts.length + 1,
      score: earnedPoints,
      totalPoints,
      percentage,
      answers: gradedAnswers,
      startedAt: new Date(),
      completedAt: new Date(),
      passed
    };

    progress.quizAttempts.push(attempt);

    // Update best score
    if (!progress.bestScore || percentage > progress.bestScore) {
      progress.bestScore = percentage;
    }

    // Update module status
    if (passed) {
      progress.status = 'completed';
      progress.completedAt = new Date();
    } else if (progress.quizAttempts.length >= (quiz.maxAttempts || 3)) {
      progress.status = 'failed';
    }

    await progress.save();

    res.json({
      success: true,
      message: passed ? 'Quiz passed! Congratulations!' : 'Quiz not passed. Please try again.',
      data: {
        attemptNumber: attempt.attemptNumber,
        score: earnedPoints,
        totalPoints,
        percentage: Math.round(percentage * 10) / 10,
        passed,
        remainingAttempts: (quiz.maxAttempts || 3) - progress.quizAttempts.length,
        answers: gradedAnswers,
        progress
      }
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
};

export const getUserProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { moduleId } = req.query;

    const filter: any = { userId };
    if (moduleId) {
      filter.moduleId = moduleId;
    }

    const progress = await UserProgress.find(filter).sort({ lastAccessedAt: -1 });

    // Get module details
    const progressWithModules = await Promise.all(
      progress.map(async (p) => {
        const module = await Module.findById(p.moduleId);
        return {
          ...p.toObject(),
          module: module ? {
            title: module.title,
            duration: module.duration,
            difficulty: module.difficulty,
            targetAudience: module.targetAudience
          } : null
        };
      })
    );

    res.json({
      success: true,
      count: progressWithModules.length,
      data: progressWithModules
    });
  } catch (error) {
    console.error('Get user progress error:', error);
    res.status(500).json({ error: 'Failed to fetch user progress' });
  }
};

export const getProgressStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const allProgress = await UserProgress.find({ userId });

    const stats = {
      totalModules: allProgress.length,
      completedModules: allProgress.filter(p => p.status === 'completed').length,
      inProgressModules: allProgress.filter(p => p.status === 'in_progress' || p.status === 'quiz_required').length,
      failedModules: allProgress.filter(p => p.status === 'failed').length,
      totalVideoWatchTime: allProgress.reduce((sum, p) => sum + p.videoWatchTime, 0),
      totalQuizAttempts: allProgress.reduce((sum, p) => sum + p.quizAttempts.length, 0),
      averageScore: allProgress.filter(p => p.bestScore).length > 0
        ? allProgress.reduce((sum, p) => sum + (p.bestScore || 0), 0) / allProgress.filter(p => p.bestScore).length
        : 0,
      certificatesEarned: allProgress.filter(p => p.certificateId).length
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get progress stats error:', error);
    res.status(500).json({ error: 'Failed to fetch progress statistics' });
  }
};
