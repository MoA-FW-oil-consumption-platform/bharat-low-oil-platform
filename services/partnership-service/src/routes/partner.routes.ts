import express from 'express';
import {
  registerPartner,
  authenticatePartner,
  uploadMenu,
  checkCertification,
  subscribeWebhook,
  getPartnerStats
} from '../controllers/partner.controller';
import { authenticateJWT, checkPermission } from '../middleware/auth.middleware';
import { partnerRateLimit, authRateLimit } from '../middleware/rateLimiter.middleware';

const router = express.Router();

/**
 * External Partner API Routes (for third-party restaurant integrations)
 */

// Public registration endpoint
router.post('/register', partnerRateLimit, registerPartner);

// Authentication endpoint (API key → JWT)
router.post('/auth/token', authRateLimit, authenticatePartner);

// Protected endpoints (require JWT)
router.post(
  '/menu/upload',
  partnerRateLimit,
  authenticateJWT,
  checkPermission('menu:write'),
  uploadMenu
);

router.post(
  '/certification/check',
  partnerRateLimit,
  authenticateJWT,
  checkPermission('cert:read'),
  checkCertification
);

router.post(
  '/webhook/subscribe',
  partnerRateLimit,
  authenticateJWT,
  checkPermission('webhook:manage'),
  subscribeWebhook
);

router.get(
  '/stats',
  partnerRateLimit,
  authenticateJWT,
  getPartnerStats
);

export default router;
