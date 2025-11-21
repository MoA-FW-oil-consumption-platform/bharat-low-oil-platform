import express from 'express';
import {
  connectPlatform,
  syncMenu,
  getAnalytics,
  simulateWebhook,
  getIntegrations,
  disconnectPlatform
} from '../controllers/delivery.controller';

const router = express.Router();

/**
 * Delivery Integration Routes (for internal use via admin dashboard)
 */

// Connect to delivery platform
router.post('/connect', connectPlatform);

// Sync menu to platform
router.post('/:id/sync', syncMenu);

// Get analytics for restaurant
router.get('/restaurant/:restaurantId/analytics', getAnalytics);

// Get all integrations for restaurant
router.get('/restaurant/:restaurantId', getIntegrations);

// Simulate webhook (for testing)
router.post('/:id/webhook/simulate', simulateWebhook);

// Disconnect from platform
router.delete('/:id/disconnect', disconnectPlatform);

export default router;
