import { Request, Response } from 'express';
import Joi from 'joi';
import axios from 'axios';
import PDFDocument from 'pdfkit';
import PolicyReport from '../models/PolicyReport.model';
import { PolicyCalculator } from '../utils/PolicyCalculator';

const TRACKING_SERVICE_URL = process.env.TRACKING_SERVICE_URL || 'http://localhost:3003';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3002';
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

/**
 * Simulate GST revenue impact
 */
export const simulateGST = async (req: Request, res: Response) => {
  try {
    const schema = Joi.object({
      userCount: Joi.number().min(1000).required(),
      currentDistribution: Joi.object({
        healthy: Joi.number().min(0).max(1).required(),
        regular: Joi.number().min(0).max(1).required(),
        unhealthy: Joi.number().min(0).max(1).required()
      }).required(),
      projectedDistribution: Joi.object({
        healthy: Joi.number().min(0).max(1).required(),
        regular: Joi.number().min(0).max(1).required(),
        unhealthy: Joi.number().min(0).max(1).required()
      }).required(),
      avgConsumptionPerUser: Joi.number().min(0.1).max(10).default(1.5) // liters per month
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { userCount, currentDistribution, projectedDistribution, avgConsumptionPerUser } = req.body;

    // Validate distributions sum to 1
    const currentSum = currentDistribution.healthy + currentDistribution.regular + currentDistribution.unhealthy;
    const projectedSum = projectedDistribution.healthy + projectedDistribution.regular + projectedDistribution.unhealthy;

    if (Math.abs(currentSum - 1) > 0.01 || Math.abs(projectedSum - 1) > 0.01) {
      return res.status(400).json({ 
        error: 'Distribution percentages must sum to 1.0 (100%)',
        currentSum,
        projectedSum
      });
    }

    const simulation = PolicyCalculator.simulateGSTImpact(
      userCount,
      currentDistribution,
      projectedDistribution,
      avgConsumptionPerUser
    );

    res.json({
      message: 'GST simulation completed',
      simulation,
      gstRates: PolicyCalculator.getGSTRates(),
      note: 'GST rates are simulated pending Finance Ministry integration'
    });
  } catch (error: any) {
    console.error('GST simulation error:', error);
    res.status(500).json({ error: error.message || 'Failed to simulate GST impact' });
  }
};

/**
 * Calculate national impact metrics
 */
export const getNationalImpact = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate required (YYYY-MM-DD)' });
    }

    // Fetch aggregated data from tracking service
    let trackingData;
    try {
      const response = await axios.get(`${TRACKING_SERVICE_URL}/tracking/aggregate`, {
        params: { startDate, endDate }
      });
      trackingData = response.data;
    } catch (err) {
      return res.status(502).json({ error: 'Failed to fetch tracking data from tracking-service' });
    }

    // Fetch user count from user service
    let userCount;
    try {
      const response = await axios.get(`${USER_SERVICE_URL}/users/count`);
      userCount = response.data.count || 100000; // Default fallback
    } catch (err) {
      userCount = 100000; // Default if service unavailable
    }

    // Calculate average reduction percentage
    const avgReductionPercentage = trackingData.avgReduction || 15; // Default 15%
    const avgConsumptionPerUserPerMonth = trackingData.avgConsumption || 1.5; // Default 1.5L

    const nationalImpact = PolicyCalculator.calculateNationalImpact(
      userCount,
      avgReductionPercentage,
      avgConsumptionPerUserPerMonth
    );

    // Get AI insights (optional)
    let aiInsights = null;
    try {
      const aiResponse = await axios.get(`${AI_SERVICE_URL}/insights/national`, {
        params: { totalUsers: userCount, avgReduction: avgReductionPercentage }
      });
      aiInsights = aiResponse.data;
    } catch (err) {
      // AI service optional - continue without it
      console.warn('AI service unavailable:', err);
    }

    res.json({
      period: { startDate, endDate },
      nationalImpact,
      aiInsights,
      projections: {
        next5Years: {
          oilReduction: nationalImpact.totalOilReduction * 5,
          importSavings: nationalImpact.estimatedImportSavings * 5,
          carbonReduction: nationalImpact.carbonEmissionReduced * 5
        }
      }
    });
  } catch (error: any) {
    console.error('National impact error:', error);
    res.status(500).json({ error: error.message || 'Failed to calculate national impact' });
  }
};

/**
 * Compare states by oil reduction performance
 */
export const compareStates = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, limit = 28 } = req.query; // 28 states + 8 UTs

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate required (YYYY-MM-DD)' });
    }

    // Fetch state-wise data from tracking service
    let stateData;
    try {
      const response = await axios.get(`${TRACKING_SERVICE_URL}/tracking/aggregate/states`, {
        params: { startDate, endDate }
      });
      stateData = response.data.states || [];
    } catch (err) {
      // Mock data if tracking service unavailable
      stateData = generateMockStateData();
    }

    // Rank states
    const rankedStates = PolicyCalculator.rankStates(stateData);

    // Get top and bottom performers
    const topPerformers = rankedStates.slice(0, 5);
    const bottomPerformers = rankedStates.slice(-5).reverse();

    res.json({
      period: { startDate, endDate },
      totalStates: rankedStates.length,
      rankings: rankedStates.slice(0, Number(limit)),
      topPerformers,
      bottomPerformers,
      insights: {
        bestState: topPerformers[0],
        avgReduction: (rankedStates.reduce((sum, s) => sum + s.avgReduction, 0) / rankedStates.length).toFixed(2),
        totalUsers: rankedStates.reduce((sum, s) => sum + s.users, 0)
      }
    });
  } catch (error: any) {
    console.error('State comparison error:', error);
    res.status(500).json({ error: error.message || 'Failed to compare states' });
  }
};

/**
 * Generate ministerial PDF report
 */
export const generateReport = async (req: Request, res: Response) => {
  try {
    const schema = Joi.object({
      reportType: Joi.string().valid('gst_simulation', 'national_impact', 'state_comparison', 'ministerial_summary').required(),
      startDate: Joi.date().required(),
      endDate: Joi.date().required(),
      includeProjections: Joi.boolean().default(true),
      includeStateRankings: Joi.boolean().default(true)
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const userId = (req as any).user?.id || 'admin';
    const { reportType, startDate, endDate, includeProjections, includeStateRankings } = req.body;

    // Fetch data for report
    const reportData = await fetchReportData(reportType, startDate, endDate);

    // Generate report ID
    const reportId = `RPT_${reportType}_${Date.now()}`;

    // Create PDF
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));

    // Header
    doc.fontSize(24).text('Government of India', { align: 'center' });
    doc.fontSize(14).text('Ministry of Food & Welfare', { align: 'center' });
    doc.fontSize(18).text('Bharat Low-Oil Campaign', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(getReportTitle(reportType), { align: 'center', underline: true });
    doc.moveDown();

    // Period
    doc.fontSize(10).text(`Report Period: ${new Date(startDate).toLocaleDateString('en-IN')} to ${new Date(endDate).toLocaleDateString('en-IN')}`);
    doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`);
    doc.text(`Report ID: ${reportId}`);
    doc.moveDown();

    // Executive Summary
    doc.fontSize(14).text('Executive Summary', { underline: true });
    doc.fontSize(10);
    doc.text(`Total Registered Users: ${reportData.totalUsers.toLocaleString('en-IN')}`);
    doc.text(`Average Oil Reduction: ${reportData.avgReduction}%`);
    doc.text(`Estimated Import Savings: ₹${reportData.importSavings.toLocaleString('en-IN')} Crores`);
    doc.text(`Healthcare Cost Averted: ₹${reportData.healthcareSavings.toLocaleString('en-IN')} Crores`);
    doc.text(`Carbon Emission Reduced: ${reportData.carbonReduction.toLocaleString('en-IN')} Tonnes CO₂`);
    doc.moveDown();

    // GST Impact (if applicable)
    if (reportType === 'gst_simulation' || reportType === 'ministerial_summary') {
      doc.fontSize(14).text('GST Revenue Impact', { underline: true });
      doc.fontSize(10);
      doc.text(`Current Annual GST Revenue: ₹${reportData.gstCurrent?.toLocaleString('en-IN')} Crores`);
      doc.text(`Projected Annual GST Revenue: ₹${reportData.gstProjected?.toLocaleString('en-IN')} Crores`);
      doc.fillColor(reportData.gstImpact < 0 ? 'red' : 'green')
        .text(`GST Revenue Change: ₹${reportData.gstImpact?.toLocaleString('en-IN')} Crores (${reportData.gstChange}%)`)
        .fillColor('black');
      doc.moveDown();
    }

    // State Rankings (if requested)
    if (includeStateRankings && reportData.stateRankings) {
      doc.fontSize(14).text('Top 10 Performing States', { underline: true });
      doc.fontSize(9);
      reportData.stateRankings.slice(0, 10).forEach((state: any, idx: number) => {
        doc.text(`${idx + 1}. ${state.state}: ${state.avgReduction}% reduction (${state.users.toLocaleString('en-IN')} users)`);
      });
      doc.moveDown();
    }

    // Recommendations
    doc.fontSize(14).text('Policy Recommendations', { underline: true });
    doc.fontSize(10);
    const recommendations = generateRecommendations(reportData);
    recommendations.forEach((rec: string, idx: number) => {
      doc.text(`${idx + 1}. ${rec}`);
    });
    doc.moveDown();

    // Projections (if requested)
    if (includeProjections) {
      doc.fontSize(14).text('5-Year Projections', { underline: true });
      doc.fontSize(10);
      doc.text(`Estimated Oil Reduction: ${(reportData.totalOilReduction * 5).toLocaleString('en-IN')} Tonnes`);
      doc.text(`Estimated Import Savings: ₹${(reportData.importSavings * 5).toLocaleString('en-IN')} Crores`);
      doc.text(`Estimated Healthcare Savings: ₹${(reportData.healthcareSavings * 5).toLocaleString('en-IN')} Crores`);
      doc.moveDown();
    }

    // Footer
    doc.fontSize(8).text('Confidential - For Government Use Only', { align: 'center' });
    doc.text('Bharat Low-Oil Campaign Platform | Ministry of Food & Welfare', { align: 'center' });

    doc.end();

    // Wait for PDF generation
    await new Promise((resolve) => doc.on('end', resolve));
    const pdfBuffer = Buffer.concat(chunks);

    // Save report metadata to database
    const report = await PolicyReport.create({
      reportId,
      reportType,
      period: {
        startDate,
        endDate,
        description: `${reportType} report for ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`
      },
      generatedBy: userId,
      metrics: {
        totalUsers: reportData.totalUsers,
        avgReduction: reportData.avgReduction,
        estimatedImportSavings: reportData.importSavings,
        healthcareCostAverted: reportData.healthcareSavings,
        gstRevenueImpact: reportData.gstImpact || 0,
        carbonEmissionReduced: reportData.carbonReduction
      },
      stateData: reportData.stateRankings?.slice(0, 10),
      gstSimulation: reportData.gstCurrent ? {
        currentRevenue: reportData.gstCurrent,
        projectedRevenue: reportData.gstProjected,
        revenueDifference: reportData.gstImpact,
        percentageChange: reportData.gstChange
      } : undefined,
      recommendations,
      status: 'published'
    });

    // Return PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${reportId}.pdf`);
    res.send(pdfBuffer);
  } catch (error: any) {
    console.error('Generate report error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate report' });
  }
};

/**
 * Get all policy reports
 */
export const getReports = async (req: Request, res: Response) => {
  try {
    const { reportType, status, limit = 20 } = req.query;

    const filter: any = {};
    if (reportType) filter.reportType = reportType;
    if (status) filter.status = status;

    const reports = await PolicyReport.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({
      count: reports.length,
      reports: reports.map(r => ({
        reportId: r.reportId,
        reportType: r.reportType,
        period: r.period,
        metrics: r.metrics,
        status: r.status,
        createdAt: r.createdAt
      }))
    });
  } catch (error: any) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: error.message || 'Failed to get reports' });
  }
};

/**
 * Get cost-benefit analysis
 */
export const getCostBenefit = async (req: Request, res: Response) => {
  try {
    const schema = Joi.object({
      programCost: Joi.number().min(1).required(), // in INR crores
      totalUsers: Joi.number().min(1000).required(),
      avgReduction: Joi.number().min(1).max(100).required(),
      avgConsumption: Joi.number().min(0.1).default(1.5)
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { programCost, totalUsers, avgReduction, avgConsumption } = req.body;

    const nationalImpact = PolicyCalculator.calculateNationalImpact(
      totalUsers,
      avgReduction,
      avgConsumption
    );

    const costBenefit = PolicyCalculator.calculateCostBenefit(programCost, nationalImpact);

    res.json({
      programCost: `₹${programCost} Crores`,
      nationalImpact,
      costBenefit,
      verdict: costBenefit.roi > 0 ? 'Program is economically viable' : 'Program needs optimization'
    });
  } catch (error: any) {
    console.error('Cost-benefit error:', error);
    res.status(500).json({ error: error.message || 'Failed to calculate cost-benefit' });
  }
};

// Helper functions

function getReportTitle(reportType: string): string {
  const titles: any = {
    gst_simulation: 'GST Revenue Impact Analysis',
    national_impact: 'National Oil Consumption Impact Report',
    state_comparison: 'State-wise Performance Comparison',
    ministerial_summary: 'Ministerial Executive Summary'
  };
  return titles[reportType] || 'Policy Report';
}

async function fetchReportData(reportType: string, startDate: Date, endDate: Date): Promise<any> {
  // Fetch data from various services
  const totalUsers = 250000; // Mock data - fetch from user-service in production
  const avgReduction = 18.5;
  const avgConsumption = 1.5;

  const nationalImpact = PolicyCalculator.calculateNationalImpact(totalUsers, avgReduction, avgConsumption);

  const stateRankings = PolicyCalculator.rankStates(generateMockStateData());

  return {
    totalUsers,
    avgReduction,
    importSavings: nationalImpact.estimatedImportSavings,
    healthcareSavings: nationalImpact.healthcareCostAverted,
    carbonReduction: nationalImpact.carbonEmissionReduced,
    totalOilReduction: nationalImpact.totalOilReduction,
    gstCurrent: 1250,
    gstProjected: 1180,
    gstImpact: -70,
    gstChange: -5.6,
    stateRankings
  };
}

function generateRecommendations(reportData: any): string[] {
  const recommendations = [];

  if (reportData.avgReduction < 15) {
    recommendations.push('Intensify awareness campaigns in underperforming states');
  }

  if (reportData.gstImpact < 0) {
    recommendations.push('Consider tax incentives for healthy oil producers to offset GST revenue loss');
  }

  recommendations.push('Expand institutional kitchen program to government hospitals and schools');
  recommendations.push('Partner with food delivery platforms for wider low-oil menu promotion');
  recommendations.push('Integrate blockchain certification with FSSAI for restaurant compliance');

  if (reportData.carbonReduction > 10000) {
    recommendations.push('Leverage carbon credits for international climate commitments');
  }

  return recommendations;
}

function generateMockStateData(): any[] {
  const states = [
    'Maharashtra', 'Tamil Nadu', 'Karnataka', 'Gujarat', 'Kerala',
    'West Bengal', 'Rajasthan', 'Uttar Pradesh', 'Delhi', 'Punjab',
    'Haryana', 'Madhya Pradesh', 'Telangana', 'Andhra Pradesh', 'Odisha'
  ];

  return states.map(state => ({
    state,
    users: Math.floor(Math.random() * 50000) + 5000,
    avgReduction: Number((Math.random() * 25 + 10).toFixed(2))
  }));
}
