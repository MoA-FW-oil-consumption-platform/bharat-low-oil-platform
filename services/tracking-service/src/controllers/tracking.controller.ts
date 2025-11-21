import { Request, Response } from 'express';
import OilLog from '../models/OilLog.model';
import Joi from 'joi';

const logSchema = Joi.object({
  userId: Joi.string().required(),
  amount: Joi.number().min(0).required(),
  oilType: Joi.string().valid('sunflower', 'palm', 'mustard', 'groundnut', 'coconut', 'olive', 'other').required(),
  date: Joi.date().default(Date.now),
  source: Joi.string().valid('manual', 'iot', 'barcode').default('manual'),
  notes: Joi.string().allow(''),
  deviceId: Joi.string()
});

export const createLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = logSchema.validate(req.body);
    
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const log = new OilLog(value);
    await log.save();

    res.status(201).json({
      message: 'Oil log created successfully',
      log
    });
  } catch (error) {
    console.error('Create log error:', error);
    res.status(500).json({ error: 'Failed to create log' });
  }
};

export const getLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { startDate, endDate, limit = 50, skip = 0 } = req.query;

    const query: any = { userId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    const logs = await OilLog.find(query)
      .sort({ date: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await OilLog.countDocuments(query);

    res.json({
      logs,
      pagination: {
        total,
        limit: Number(limit),
        skip: Number(skip)
      }
    });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ error: 'Failed to get logs' });
  }
};

export const getMonthlyUsage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { year, month } = req.query;

    const currentYear = year ? Number(year) : new Date().getFullYear();
    const currentMonth = month ? Number(month) - 1 : new Date().getMonth();

    const startDate = new Date(currentYear, currentMonth, 1);
    const endDate = new Date(currentYear, currentMonth + 1, 0);

    const logs = await OilLog.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    });

    const totalUsage = logs.reduce((sum, log) => sum + log.amount, 0);
    const byOilType: Record<string, number> = {};

    logs.forEach(log => {
      byOilType[log.oilType] = (byOilType[log.oilType] || 0) + log.amount;
    });

    // ICMR recommendation: 12kg per person per year = 1kg per person per month = 1000ml
    const recommendedMonthly = 1000; // ml per person
    const riskLevel = calculateRisk(totalUsage, recommendedMonthly);

    res.json({
      userId,
      period: {
        year: currentYear,
        month: currentMonth + 1
      },
      totalUsage,
      byOilType,
      logCount: logs.length,
      recommended: recommendedMonthly,
      riskLevel
    });
  } catch (error) {
    console.error('Get monthly usage error:', error);
    res.status(500).json({ error: 'Failed to get monthly usage' });
  }
};

export const deleteLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { logId } = req.params;

    const log = await OilLog.findByIdAndDelete(logId);

    if (!log) {
      res.status(404).json({ error: 'Log not found' });
      return;
    }

    res.json({ message: 'Log deleted successfully' });
  } catch (error) {
    console.error('Delete log error:', error);
    res.status(500).json({ error: 'Failed to delete log' });
  }
};

// Helper function to calculate risk
function calculateRisk(actual: number, recommended: number): {
  level: 'low' | 'moderate' | 'high';
  percentage: number;
} {
  const percentage = (actual / recommended) * 100;
  
  let level: 'low' | 'moderate' | 'high';
  if (percentage > 160) {
    level = 'high';
  } else if (percentage > 120) {
    level = 'moderate';
  } else {
    level = 'low';
  }

  return { level, percentage };
}
