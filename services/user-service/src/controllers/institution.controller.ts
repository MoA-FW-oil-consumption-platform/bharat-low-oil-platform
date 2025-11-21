import { Request, Response } from 'express';
import Joi from 'joi';
import Institution from '../models/Institution.model';

/**
 * Create institution
 */
export const createInstitution = async (req: Request, res: Response): Promise<void> => {
  try {
    const schema = Joi.object({
      type: Joi.string().valid('school', 'hospital', 'canteen', 'mdm_scheme').required(),
      name: Joi.string().required(),
      registrationNumber: Joi.string().required(),
      district: Joi.string().required(),
      state: Joi.string().required(),
      managerId: Joi.string().required(),
      contactEmail: Joi.string().email().required(),
      contactPhone: Joi.string().optional(),
      capacity: Joi.number().min(10).required(),
      mealsPerDay: Joi.number().min(1).max(4).required(),
      settings: Joi.object({
        mealTypes: Joi.array().items(Joi.string().valid('breakfast', 'lunch', 'dinner', 'snacks')),
        operatingDays: Joi.number().min(1).max(31),
        icmrPerMealLimit: Joi.number().min(5).max(30)
      }).optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    // Check if registration number already exists
    const existing = await Institution.findOne({ registrationNumber: req.body.registrationNumber });
    if (existing) {
      res.status(409).json({ error: 'Institution with this registration number already exists' });
      return;
    }

    const institution = await Institution.create(req.body);

    res.status(201).json({
      message: 'Institution created successfully',
      institution: {
        id: institution._id,
        type: institution.type,
        name: institution.name,
        registrationNumber: institution.registrationNumber,
        district: institution.district,
        state: institution.state,
        capacity: institution.capacity
      }
    });
  } catch (error: any) {
    console.error('Create institution error:', error);
    res.status(500).json({ error: error.message || 'Failed to create institution' });
  }
};

/**
 * Get institution by ID
 */
export const getInstitutionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const institution = await Institution.findById(id).populate('managerId', 'name email');

    if (!institution) {
      res.status(404).json({ error: 'Institution not found' });
      return;
    }

    res.json(institution);
  } catch (error: any) {
    console.error('Get institution error:', error);
    res.status(500).json({ error: error.message || 'Failed to get institution' });
  }
};

/**
 * Get all institutions with filters
 */
export const getInstitutions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, district, state, managerId, isActive } = req.query;

    const filter: any = {};
    if (type) filter.type = type;
    if (district) filter.district = district;
    if (state) filter.state = state;
    if (managerId) filter.managerId = managerId;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const institutions = await Institution.find(filter)
      .populate('managerId', 'name email')
      .sort({ createdAt: -1 });

    res.json(institutions);
  } catch (error: any) {
    console.error('Get institutions error:', error);
    res.status(500).json({ error: error.message || 'Failed to get institutions' });
  }
};

/**
 * Update institution
 */
export const updateInstitution = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const schema = Joi.object({
      name: Joi.string().optional(),
      contactEmail: Joi.string().email().optional(),
      contactPhone: Joi.string().optional(),
      capacity: Joi.number().min(10).optional(),
      mealsPerDay: Joi.number().min(1).max(4).optional(),
      settings: Joi.object({
        mealTypes: Joi.array().items(Joi.string().valid('breakfast', 'lunch', 'dinner', 'snacks')),
        operatingDays: Joi.number().min(1).max(31),
        icmrPerMealLimit: Joi.number().min(5).max(30)
      }).optional(),
      isActive: Joi.boolean().optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const institution = await Institution.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!institution) {
      res.status(404).json({ error: 'Institution not found' });
      return;
    }

    res.json({
      message: 'Institution updated successfully',
      institution
    });
  } catch (error: any) {
    console.error('Update institution error:', error);
    res.status(500).json({ error: error.message || 'Failed to update institution' });
  }
};

/**
 * Verify institution (admin only)
 */
export const verifyInstitution = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const institution = await Institution.findByIdAndUpdate(
      id,
      { verifiedAt: new Date() },
      { new: true }
    );

    if (!institution) {
      res.status(404).json({ error: 'Institution not found' });
      return;
    }

    res.json({
      message: 'Institution verified successfully',
      institution: {
        id: institution._id,
        name: institution.name,
        verifiedAt: institution.verifiedAt
      }
    });
  } catch (error: any) {
    console.error('Verify institution error:', error);
    res.status(500).json({ error: error.message || 'Failed to verify institution' });
  }
};

/**
 * Delete institution
 */
export const deleteInstitution = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const institution = await Institution.findByIdAndDelete(id);

    if (!institution) {
      res.status(404).json({ error: 'Institution not found' });
      return;
    }

    res.json({
      message: 'Institution deleted successfully',
      institutionId: id
    });
  } catch (error: any) {
    console.error('Delete institution error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete institution' });
  }
};
