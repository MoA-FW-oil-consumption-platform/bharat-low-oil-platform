import express from 'express';
import {
  bulkLogConsumption,
  getComplianceReport,
  generatePDFReport,
  getDistrictAggregation
} from '../controllers/institutional.controller';

const router = express.Router();

/**
 * Institutional Kitchen Logging Routes
 */

// Bulk log daily consumption
router.post('/:institutionId/bulk-log', bulkLogConsumption);

// Get compliance report for month
router.get('/:institutionId/compliance', getComplianceReport);

// Generate PDF compliance report
router.get('/:institutionId/compliance/pdf', generatePDFReport);

// Get district-level aggregation
router.get('/district/:district', getDistrictAggregation);

export default router;
