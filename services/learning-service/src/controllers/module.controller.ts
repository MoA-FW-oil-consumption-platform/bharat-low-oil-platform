import { Response } from 'express';
import Joi from 'joi';
import Module from '../models/Module.model';
import { AuthRequest } from '../middleware/auth';

// Validation schemas
const createModuleSchema = Joi.object({
  title: Joi.string().required(),
  titleHindi: Joi.string().optional(),
  titleTamil: Joi.string().optional(),
  titleBengali: Joi.string().optional(),
  titleTelugu: Joi.string().optional(),
  description: Joi.string().required(),
  descriptionHindi: Joi.string().optional(),
  descriptionTamil: Joi.string().optional(),
  descriptionBengali: Joi.string().optional(),
  descriptionTelugu: Joi.string().optional(),
  content: Joi.string().required(),
  contentHindi: Joi.string().optional(),
  contentTamil: Joi.string().optional(),
  contentBengali: Joi.string().optional(),
  contentTelugu: Joi.string().optional(),
  videoUrl: Joi.string().uri().optional(),
  thumbnailUrl: Joi.string().uri().optional(),
  quizId: Joi.string().optional(),
  targetAudience: Joi.string().valid('school', 'community', 'institutional', 'mdm', 'general').required(),
  ageGroup: Joi.string().optional(),
  duration: Joi.number().min(1).required(),
  difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced').default('beginner'),
  prerequisites: Joi.array().items(Joi.string()).optional(),
  learningObjectives: Joi.array().items(Joi.string()).required(),
  topics: Joi.array().items(Joi.string()).optional(),
  order: Joi.number().default(0),
  isPublished: Joi.boolean().default(false)
});

export const getModules = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { targetAudience, difficulty, language, isPublished } = req.query;

    const filter: any = {};
    
    if (targetAudience) {
      filter.targetAudience = targetAudience;
    }
    
    if (difficulty) {
      filter.difficulty = difficulty;
    }

    // Only show published modules to non-admin users
    if (req.user?.role !== 'admin') {
      filter.isPublished = true;
    } else if (isPublished !== undefined) {
      filter.isPublished = isPublished === 'true';
    }

    const modules = await Module.find(filter).sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      count: modules.length,
      data: modules,
      language: language || 'en'
    });
  } catch (error) {
    console.error('Get modules error:', error);
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
};

export const getModuleById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const module = await Module.findById(id);

    if (!module) {
      res.status(404).json({ error: 'Module not found' });
      return;
    }

    // Check if user has access to unpublished module
    if (!module.isPublished && req.user?.role !== 'admin') {
      res.status(403).json({ error: 'Module not available' });
      return;
    }

    res.json({
      success: true,
      data: module
    });
  } catch (error) {
    console.error('Get module error:', error);
    res.status(500).json({ error: 'Failed to fetch module' });
  }
};

export const createModule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = createModuleSchema.validate(req.body);

    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const module = new Module({
      ...value,
      createdBy: req.user?.userId
    });

    await module.save();

    res.status(201).json({
      success: true,
      message: 'Module created successfully',
      data: module
    });
  } catch (error) {
    console.error('Create module error:', error);
    res.status(500).json({ error: 'Failed to create module' });
  }
};

export const updateModule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const module = await Module.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!module) {
      res.status(404).json({ error: 'Module not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Module updated successfully',
      data: module
    });
  } catch (error) {
    console.error('Update module error:', error);
    res.status(500).json({ error: 'Failed to update module' });
  }
};

export const deleteModule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const module = await Module.findByIdAndDelete(id);

    if (!module) {
      res.status(404).json({ error: 'Module not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Module deleted successfully'
    });
  } catch (error) {
    console.error('Delete module error:', error);
    res.status(500).json({ error: 'Failed to delete module' });
  }
};

export const getModuleStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalModules = await Module.countDocuments();
    const publishedModules = await Module.countDocuments({ isPublished: true });
    
    const byAudience = await Module.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$targetAudience', count: { $sum: 1 } } }
    ]);

    const byDifficulty = await Module.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$difficulty', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalModules,
        publishedModules,
        byAudience,
        byDifficulty
      }
    });
  } catch (error) {
    console.error('Get module stats error:', error);
    res.status(500).json({ error: 'Failed to fetch module statistics' });
  }
};
