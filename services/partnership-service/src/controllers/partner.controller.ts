import { Request, Response } from 'express';
import Joi from 'joi';
import crypto from 'crypto';
import PartnerAuth from '../models/PartnerAuth.model';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

/**
 * Register external partner and generate API key
 */
export const registerPartner = async (req: Request, res: Response) => {
  try {
    const schema = Joi.object({
      restaurantId: Joi.string().required(),
      restaurantName: Joi.string().required(),
      email: Joi.string().email().optional(),
      phone: Joi.string().optional(),
      permissions: Joi.array().items(
        Joi.string().valid('menu:read', 'menu:write', 'cert:read', 'orders:read', 'webhook:manage')
      ).optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { restaurantId, restaurantName, permissions } = req.body;

    // Check if partner already exists
    const existing = await PartnerAuth.findOne({ restaurantId });
    if (existing) {
      return res.status(409).json({ error: 'Partner already registered' });
    }

    // Generate unique partner ID and API key
    const partnerId = `partner_${crypto.randomBytes(8).toString('hex')}`;
    const apiKey = `bloc_${crypto.randomBytes(32).toString('hex')}`;

    // Create partner auth record
    const partner = await PartnerAuth.create({
      partnerId,
      restaurantId,
      restaurantName,
      apiKey, // Store plain text temporarily
      apiKeyHashed: apiKey, // Will be hashed by pre-save hook
      permissions: permissions || ['menu:read', 'menu:write', 'cert:read'],
      rateLimit: 100,
      isActive: true
    });

    // Clear plain text API key from database
    partner.apiKey = '';
    await partner.save();

    res.status(201).json({
      message: 'Partner registered successfully',
      partner: {
        partnerId,
        restaurantId,
        restaurantName,
        apiKey, // Show only once
        permissions: partner.permissions,
        rateLimit: partner.rateLimit
      },
      warning: 'Store this API key securely. It will not be shown again.'
    });
  } catch (error: any) {
    console.error('Register partner error:', error);
    res.status(500).json({ error: error.message || 'Failed to register partner' });
  }
};

/**
 * Authenticate and get JWT token (for external restaurant APIs)
 */
export const authenticatePartner = async (req: Request, res: Response) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
      return res.status(401).json({ error: 'API key required' });
    }

    // Find partner by API key prefix
    const partners = await PartnerAuth.find({ isActive: true });
    
    let authenticatedPartner = null;
    for (const partner of partners) {
      const isValid = await partner.compareApiKey(apiKey);
      if (isValid) {
        authenticatedPartner = partner;
        break;
      }
    }

    if (!authenticatedPartner) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    // Update usage
    authenticatedPartner.lastUsedAt = new Date();
    authenticatedPartner.usageCount += 1;
    await authenticatedPartner.save();

    // Generate JWT
    const token = jwt.sign(
      {
        partnerId: authenticatedPartner.partnerId,
        restaurantId: authenticatedPartner.restaurantId,
        permissions: authenticatedPartner.permissions
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      expiresIn: '24h',
      partner: {
        partnerId: authenticatedPartner.partnerId,
        restaurantId: authenticatedPartner.restaurantId,
        permissions: authenticatedPartner.permissions
      }
    });
  } catch (error: any) {
    console.error('Authenticate partner error:', error);
    res.status(500).json({ error: error.message || 'Authentication failed' });
  }
};

/**
 * Upload menu items (bulk API for external restaurants)
 */
export const uploadMenu = async (req: Request, res: Response) => {
  try {
    const schema = Joi.object({
      items: Joi.array().items(
        Joi.object({
          name: Joi.string().required(),
          oilAmount: Joi.number().min(0).required(),
          category: Joi.string().optional(),
          price: Joi.number().min(0).optional(),
          description: Joi.string().optional()
        })
      ).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const partner = (req as any).partner; // From auth middleware
    const { items } = req.body;

    // Process items and add low-oil certification
    const processedItems = items.map((item: any) => ({
      ...item,
      lowOilCertified: item.oilAmount < 15,
      certificationBadge: item.oilAmount < 15 ? '🟢 BLOC Low-Oil Certified' : null,
      uploadedAt: new Date()
    }));

    const lowOilCount = processedItems.filter((item: any) => item.lowOilCertified).length;

    // In production, this would save to tracking-service or menu database
    res.json({
      message: 'Menu uploaded successfully',
      restaurantId: partner.restaurantId,
      summary: {
        totalItems: items.length,
        lowOilCertified: lowOilCount,
        certificationRate: Math.round((lowOilCount / items.length) * 100),
        uploadedAt: new Date()
      },
      items: processedItems
    });
  } catch (error: any) {
    console.error('Upload menu error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload menu' });
  }
};

/**
 * Check certification status via blockchain
 */
export const checkCertification = async (req: Request, res: Response) => {
  try {
    const schema = Joi.object({
      restaurantId: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { restaurantId } = req.body;

    // Mock blockchain query (in production, query actual smart contract)
    const mockCertification = {
      restaurantId,
      certificateId: `CERT_${restaurantId}_${Date.now()}`,
      level: 'Gold', // Bronze, Silver, Gold, Platinum
      score: 85,
      issueDate: new Date(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      verificationUrl: `${process.env.BLOCKCHAIN_EXPLORER_URL || 'https://etherscan.io'}/tx/${crypto.randomBytes(32).toString('hex')}`,
      status: 'active',
      criteria: {
        lowOilMenuPercentage: 65,
        customerSatisfaction: 4.5,
        complianceScore: 90
      }
    };

    res.json({
      message: 'Certification retrieved successfully',
      certification: mockCertification
    });
  } catch (error: any) {
    console.error('Check certification error:', error);
    res.status(500).json({ error: error.message || 'Failed to check certification' });
  }
};

/**
 * Subscribe to webhooks
 */
export const subscribeWebhook = async (req: Request, res: Response) => {
  try {
    const schema = Joi.object({
      webhookUrl: Joi.string().uri().required(),
      events: Joi.array().items(
        Joi.string().valid('certification_updated', 'compliance_alert', 'menu_sync', 'order_placed')
      ).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const partner = (req as any).partner;
    const { webhookUrl, events } = req.body;

    // In production, save webhook configuration to database
    const webhookConfig = {
      partnerId: partner.partnerId,
      restaurantId: partner.restaurantId,
      webhookUrl,
      events,
      secret: crypto.randomBytes(32).toString('hex'), // For HMAC signature verification
      subscribedAt: new Date(),
      isActive: true
    };

    res.json({
      message: 'Webhook subscribed successfully',
      webhook: {
        ...webhookConfig,
        verificationNote: 'Use the provided secret to verify webhook signatures (HMAC-SHA256)'
      }
    });
  } catch (error: any) {
    console.error('Subscribe webhook error:', error);
    res.status(500).json({ error: error.message || 'Failed to subscribe webhook' });
  }
};

/**
 * Get partner usage stats
 */
export const getPartnerStats = async (req: Request, res: Response) => {
  try {
    const partner = (req as any).partner;

    const partnerAuth = await PartnerAuth.findOne({ partnerId: partner.partnerId });
    if (!partnerAuth) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    res.json({
      partnerId: partner.partnerId,
      restaurantId: partner.restaurantId,
      stats: {
        totalRequests: partnerAuth.usageCount,
        lastUsedAt: partnerAuth.lastUsedAt,
        rateLimit: partnerAuth.rateLimit,
        permissions: partnerAuth.permissions,
        accountAge: Math.floor((Date.now() - partnerAuth.createdAt.getTime()) / (1000 * 60 * 60 * 24)),
        status: partnerAuth.isActive ? 'active' : 'inactive'
      }
    });
  } catch (error: any) {
    console.error('Get partner stats error:', error);
    res.status(500).json({ error: error.message || 'Failed to get stats' });
  }
};
