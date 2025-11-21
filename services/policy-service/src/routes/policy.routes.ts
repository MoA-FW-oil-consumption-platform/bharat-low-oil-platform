import express from 'express';
import {
  simulateGST,
  getNationalImpact,
  compareStates,
  generateReport,
  getReports,
  getCostBenefit
} from '../controllers/policy.controller';

const router = express.Router();

/**
 * Policy Dashboard Routes
 */

// GST simulation
router.post('/gst-simulation', simulateGST);

// National impact metrics
router.get('/national-impact', getNationalImpact);

// State comparison
router.get('/state-comparison', compareStates);

// Generate ministerial report (PDF)
router.post('/generate-report', generateReport);

// Get all reports
router.get('/reports', getReports);

// Cost-benefit analysis
router.post('/cost-benefit', getCostBenefit);

export default router;
