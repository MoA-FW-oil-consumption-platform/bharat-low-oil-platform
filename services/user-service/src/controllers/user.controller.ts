import { Request, Response } from 'express';
import User from '../models/User.model';
import Joi from 'joi';

const profileSchema = Joi.object({
  userId: Joi.string().required(),
  email: Joi.string().email().required(),
  fullName: Joi.string().required(),
  age: Joi.number().min(1).max(120),
  gender: Joi.string().valid('male', 'female', 'other'),
  familySize: Joi.number().min(1).required(),
  region: Joi.string(),
  dietaryHabit: Joi.string().valid('vegetarian', 'non-vegetarian'),
  healthConditions: Joi.array().items(Joi.string()),
  monthlyOilConsumption: Joi.number().min(0),
  preferences: Joi.object({
    language: Joi.string().default('en'),
    notifications: Joi.boolean().default(true)
  })
});

export const createProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = profileSchema.validate(req.body);
    
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const existingUser = await User.findOne({ 
      $or: [{ userId: value.userId }, { email: value.email }]
    });

    if (existingUser) {
      res.status(409).json({ error: 'User already exists' });
      return;
    }

    const user = new User(value);
    await user.save();

    res.status(201).json({
      message: 'Profile created successfully',
      user
    });
  } catch (error) {
    console.error('Create profile error:', error);
    res.status(500).json({ error: 'Failed to create profile' });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ userId });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findOneAndUpdate(
      { userId },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const deleteProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findOneAndDelete({ userId });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({ error: 'Failed to delete profile' });
  }
};
