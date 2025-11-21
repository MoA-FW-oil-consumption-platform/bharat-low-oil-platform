import { Request, Response } from 'express';
import Joi from 'joi';
import InstitutionalLog from '../models/InstitutionalLog.model';
import axios from 'axios';
import PDFDocument from 'pdfkit';

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3002';

/**
 * Bulk log cafeteria daily consumption
 */
export const bulkLogConsumption = async (req: Request, res: Response) => {
  try {
    const { institutionId } = req.params;

    const schema = Joi.object({
      logs: Joi.array().items(
        Joi.object({
          date: Joi.date().required(),
          mealType: Joi.string().valid('breakfast', 'lunch', 'dinner', 'snacks').required(),
          mealsServed: Joi.number().min(1).required(),
          oilUsed: Joi.number().min(0).required(),
          ingredients: Joi.array().items(Joi.string()).optional(),
          notes: Joi.string().optional()
        })
      ).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const staffId = (req as any).user?.id; // From JWT middleware
    if (!staffId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Fetch institution to get ICMR limits
    let institution;
    try {
      const response = await axios.get(`${USER_SERVICE_URL}/api/institutions/${institutionId}`);
      institution = response.data;
    } catch (err) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    const { logs } = req.body;
    const icmrLimit = institution.settings?.icmrPerMealLimit || 20;

    // Validate oil per meal is reasonable (not exceeding 100ml)
    const invalidLogs = logs.filter((log: any) => {
      const oilPerMeal = log.oilUsed / log.mealsServed;
      return oilPerMeal > 100;
    });

    if (invalidLogs.length > 0) {
      return res.status(400).json({
        error: 'Unreasonable oil consumption detected',
        details: 'Oil per meal cannot exceed 100ml. Please verify your entries.',
        invalidLogs
      });
    }

    // Create logs
    const createdLogs = await InstitutionalLog.insertMany(
      logs.map((log: any) => ({
        institutionId,
        staffId,
        ...log,
        oilPerMeal: log.oilUsed / log.mealsServed
      }))
    );

    // Calculate compliance
    const avgOilPerMeal =
      createdLogs.reduce((sum, log) => sum + log.oilPerMeal, 0) / createdLogs.length;
    const isCompliant = avgOilPerMeal <= icmrLimit;

    return res.status(201).json({
      message: 'Consumption logged successfully',
      summary: {
        logsCreated: createdLogs.length,
        totalMeals: logs.reduce((sum: number, log: any) => sum + log.mealsServed, 0),
        totalOilUsed: logs.reduce((sum: number, log: any) => sum + log.oilUsed, 0),
        avgOilPerMeal: Number(avgOilPerMeal.toFixed(2)),
        icmrLimit,
        compliance: isCompliant ? 'compliant' : 'non-compliant'
      }
    });
  } catch (error: any) {
    console.error('Bulk log error:', error);
    return res.status(500).json({ error: error.message || 'Failed to log consumption' });
  }
};

/**
 * Get compliance report for institution
 */
export const getComplianceReport = async (req: Request, res: Response) => {
  try {
    const { institutionId } = req.params;
    const { month } = req.query; // YYYY-MM format

    if (!month || !/^\d{4}-\d{2}$/.test(month as string)) {
      return res.status(400).json({ error: 'Valid month required (YYYY-MM format)' });
    }

    // Fetch institution
    let institution;
    try {
      const response = await axios.get(`${USER_SERVICE_URL}/api/institutions/${institutionId}`);
      institution = response.data;
    } catch (err) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    // Calculate date range
    const [year, monthNum] = (month as string).split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0);

    // Fetch logs for the month
    const logs = await InstitutionalLog.find({
      institutionId,
      date: { $gte: startDate, $lte: endDate }
    });

    if (logs.length === 0) {
      return res.status(404).json({ error: 'No logs found for this month' });
    }

    // Calculate metrics
    const totalMeals = logs.reduce((sum, log) => sum + log.mealsServed, 0);
    const totalOil = logs.reduce((sum, log) => sum + log.oilUsed, 0);
    const avgOilPerMeal = totalOil / totalMeals;
    const icmrLimit = institution.settings?.icmrPerMealLimit || 20;
    const isCompliant = avgOilPerMeal <= icmrLimit;

    // MDM compliance (for schools)
    const mdmCompliant = institution.type === 'school' || institution.type === 'mdm_scheme'
      ? avgOilPerMeal <= 15 // Stricter limit for MDM
      : null;

    // Cost analysis
    const oilPrice = 150; // ₹150 per liter average
    const costPerMeal = (avgOilPerMeal / 1000) * oilPrice;
    const totalCost = (totalOil / 1000) * oilPrice;

    // Breakdown by meal type
    const mealTypeBreakdown = logs.reduce((acc: any, log) => {
      const type = log.mealType;
      if (!acc[type]) {
        acc[type] = { meals: 0, oil: 0, count: 0 };
      }
      acc[type].meals += log.mealsServed;
      acc[type].oil += log.oilUsed;
      acc[type].count += 1;
      return acc;
    }, {});

    Object.keys(mealTypeBreakdown).forEach(type => {
      const data = mealTypeBreakdown[type];
      data.avgOilPerMeal = Number((data.oil / data.meals).toFixed(2));
    });

    return res.json({
      institutionId,
      institutionName: institution.name,
      institutionType: institution.type,
      month: month as string,
      metrics: {
        totalMeals,
        totalOilUsed: Number(totalOil.toFixed(2)),
        avgOilPerMeal: Number(avgOilPerMeal.toFixed(2)),
        icmrLimit,
        compliance: isCompliant ? 'compliant' : 'non-compliant',
        mdmCompliant: mdmCompliant !== null ? (mdmCompliant ? 'yes' : 'no') : 'n/a'
      },
      costAnalysis: {
        costPerMeal: Number(costPerMeal.toFixed(2)),
        totalMonthlyCost: Number(totalCost.toFixed(2)),
        currency: 'INR'
      },
      mealTypeBreakdown,
      recommendations: avgOilPerMeal > icmrLimit
        ? [
            'Consider using air fryers or grills',
            'Switch to cooking methods requiring less oil',
            'Use oil spray instead of pouring',
            'Increase steamed and boiled items in menu'
          ]
        : ['Great job! Keep maintaining healthy oil levels']
    });
  } catch (error: any) {
    console.error('Get compliance report error:', error);
    return res.status(500).json({ error: error.message || 'Failed to get compliance report' });
  }
};

/**
 * Generate monthly compliance PDF report
 */
export const generatePDFReport = async (req: Request, res: Response) => {
  try {
    const { institutionId } = req.params;
    const { month } = req.query;

    if (!month || !/^\d{4}-\d{2}$/.test(month as string)) {
      return res.status(400).json({ error: 'Valid month required (YYYY-MM format)' });
    }

    // Get compliance data (reuse logic from getComplianceReport)
    const reportData = await getComplianceReportData(institutionId, month as string);

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=compliance_${institutionId}_${month}.pdf`
    );
    doc.pipe(res);

    // Header
    doc.fontSize(20).text('Institutional Oil Consumption Compliance Report', { align: 'center' });
    doc.fontSize(10).text('Government of India | Bharat Low-Oil Campaign', { align: 'center' });
    doc.moveDown();

    // Institution details
    doc.fontSize(12).text(`Institution: ${reportData.institutionName}`);
    doc.text(`Type: ${reportData.institutionType.toUpperCase()}`);
    doc.text(`Period: ${month}`);
    doc.moveDown();

    // Metrics
    doc.fontSize(14).text('Summary Metrics', { underline: true });
    doc.fontSize(10);
    doc.text(`Total Meals Served: ${reportData.metrics.totalMeals}`);
    doc.text(`Total Oil Used: ${reportData.metrics.totalOilUsed} ml`);
    doc.text(`Average Oil Per Meal: ${reportData.metrics.avgOilPerMeal} ml`);
    doc.text(`ICMR Limit: ${reportData.metrics.icmrLimit} ml per meal`);
    doc.fontSize(12)
      .fillColor(reportData.metrics.compliance === 'compliant' ? 'green' : 'red')
      .font('Helvetica-Bold')
      .text(`Compliance Status: ${reportData.metrics.compliance.toUpperCase()}`);
    doc.fillColor('black').font('Helvetica');
    doc.moveDown();

    // Cost analysis
    doc.fontSize(14).text('Cost Analysis', { underline: true });
    doc.fontSize(10);
    doc.text(`Cost Per Meal: ₹${reportData.costAnalysis.costPerMeal}`);
    doc.text(`Total Monthly Cost: ₹${reportData.costAnalysis.totalMonthlyCost}`);
    doc.moveDown();

    // Recommendations
    doc.fontSize(14).text('Recommendations', { underline: true });
    doc.fontSize(10);
    reportData.recommendations.forEach((rec: string, idx: number) => {
      doc.text(`${idx + 1}. ${rec}`);
    });

    // Footer
    doc.moveDown(2);
    doc.fontSize(8).text('Generated by Bharat Low-Oil Campaign Platform', { align: 'center' });
    doc.text(new Date().toLocaleString('en-IN'), { align: 'center' });

    doc.end();
    return;
  } catch (error: any) {
    console.error('Generate PDF report error:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate PDF report' });
  }
};

/**
 * Get district-level aggregation
 */
export const getDistrictAggregation = async (req: Request, res: Response) => {
  try {
    const { district } = req.params;
    const { state, month } = req.query;

    if (!state) {
      return res.status(400).json({ error: 'State parameter required' });
    }

    // Fetch all institutions in district
    let institutions;
    try {
      const response = await axios.get(`${USER_SERVICE_URL}/api/institutions`, {
        params: { district, state }
      });
      institutions = response.data;
    } catch (err) {
      return res.status(404).json({ error: 'No institutions found in district' });
    }

    if (!institutions || institutions.length === 0) {
      return res.status(404).json({ error: 'No institutions found in district' });
    }

    const institutionIds = institutions.map((inst: any) => inst._id);

    // Date range for aggregation
    let dateFilter: any = {};
    if (month && /^\d{4}-\d{2}$/.test(month as string)) {
      const [year, monthNum] = (month as string).split('-').map(Number);
      dateFilter = {
        $gte: new Date(year, monthNum - 1, 1),
        $lte: new Date(year, monthNum, 0)
      };
    } else {
      // Last 30 days by default
      dateFilter = {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      };
    }

    // Aggregate logs
    const aggregation = await InstitutionalLog.aggregate([
      {
        $match: {
          institutionId: { $in: institutionIds },
          date: dateFilter
        }
      },
      {
        $group: {
          _id: '$institutionId',
          totalMeals: { $sum: '$mealsServed' },
          totalOil: { $sum: '$oilUsed' },
          avgOilPerMeal: { $avg: '$oilPerMeal' },
          logCount: { $sum: 1 }
        }
      }
    ]);

    // Map institution details
    const results = aggregation.map(agg => {
      const inst = institutions.find((i: any) => i._id.toString() === agg._id.toString());
      const icmrLimit = inst?.settings?.icmrPerMealLimit || 20;
      return {
        institutionId: agg._id,
        institutionName: inst?.name || 'Unknown',
        institutionType: inst?.type || 'unknown',
        totalMeals: agg.totalMeals,
        totalOil: Number(agg.totalOil.toFixed(2)),
        avgOilPerMeal: Number(agg.avgOilPerMeal.toFixed(2)),
        icmrLimit,
        compliance: agg.avgOilPerMeal <= icmrLimit ? 'compliant' : 'non-compliant'
      };
    });

    // District summary
    const totalMeals = results.reduce((sum, r) => sum + r.totalMeals, 0);
    const totalOil = results.reduce((sum, r) => sum + r.totalOil, 0);
    const avgOilPerMeal = totalOil / totalMeals;
    const compliantCount = results.filter(r => r.compliance === 'compliant').length;

    return res.json({
      district,
      state,
      period: month || 'Last 30 days',
      summary: {
        totalInstitutions: institutions.length,
        institutionsWithLogs: results.length,
        totalMeals,
        totalOilUsed: Number(totalOil.toFixed(2)),
        avgOilPerMeal: Number(avgOilPerMeal.toFixed(2)),
        compliantInstitutions: compliantCount,
        complianceRate: Math.round((compliantCount / results.length) * 100)
      },
      institutions: results.sort((a, b) => b.totalMeals - a.totalMeals)
    });
  } catch (error: any) {
    console.error('Get district aggregation error:', error);
    return res.status(500).json({ error: error.message || 'Failed to get district aggregation' });
  }
};

// Helper function to get compliance report data
async function getComplianceReportData(institutionId: string, month: string) {
  const response = await axios.get(`${USER_SERVICE_URL}/api/institutions/${institutionId}`);
  const institution = response.data;

  const [year, monthNum] = month.split('-').map(Number);
  const startDate = new Date(year, monthNum - 1, 1);
  const endDate = new Date(year, monthNum, 0);

  const logs = await InstitutionalLog.find({
    institutionId,
    date: { $gte: startDate, $lte: endDate }
  });

  const totalMeals = logs.reduce((sum, log) => sum + log.mealsServed, 0);
  const totalOil = logs.reduce((sum, log) => sum + log.oilUsed, 0);
  const avgOilPerMeal = totalOil / totalMeals;
  const icmrLimit = institution.settings?.icmrPerMealLimit || 20;
  const isCompliant = avgOilPerMeal <= icmrLimit;

  const oilPrice = 150;
  const costPerMeal = (avgOilPerMeal / 1000) * oilPrice;
  const totalCost = (totalOil / 1000) * oilPrice;

  return {
    institutionId,
    institutionName: institution.name,
    institutionType: institution.type,
    month,
    metrics: {
      totalMeals,
      totalOilUsed: Number(totalOil.toFixed(2)),
      avgOilPerMeal: Number(avgOilPerMeal.toFixed(2)),
      icmrLimit,
      compliance: isCompliant ? 'compliant' : 'non-compliant'
    },
    costAnalysis: {
      costPerMeal: Number(costPerMeal.toFixed(2)),
      totalMonthlyCost: Number(totalCost.toFixed(2))
    },
    recommendations: avgOilPerMeal > icmrLimit
      ? [
          'Consider using air fryers or grills',
          'Switch to cooking methods requiring less oil',
          'Use oil spray instead of pouring',
          'Increase steamed and boiled items in menu'
        ]
      : ['Great job! Keep maintaining healthy oil levels']
  };
}
