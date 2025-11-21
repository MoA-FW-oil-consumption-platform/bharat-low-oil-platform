import { Request, Response } from 'express';
import Joi from 'joi';
import DeliveryIntegration from '../models/DeliveryIntegration.model';
import { MockDeliveryAdapter } from '../adapters/MockDeliveryAdapter';

/**
 * Connect restaurant to delivery platform
 */
export const connectPlatform = async (req: Request, res: Response) => {
  try {
    const schema = Joi.object({
      restaurantId: Joi.string().required(),
      restaurantName: Joi.string().required(),
      platform: Joi.string().valid('swiggy', 'zomato', 'ubereats').required(),
      webhookUrl: Joi.string().uri().optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { restaurantId, restaurantName, platform, webhookUrl } = req.body;

    // Check if already connected
    const existing = await DeliveryIntegration.findOne({ restaurantId, platform });
    if (existing) {
      return res.status(409).json({ error: `Already connected to ${platform}` });
    }

    // Simulate OAuth connection
    const adapter = new MockDeliveryAdapter(platform, restaurantId);
    const connection = await adapter.connect(restaurantName);

    // Create integration record
    const integration = await DeliveryIntegration.create({
      restaurantId,
      restaurantName,
      platform,
      mockApiKey: connection.apiKey,
      webhookUrl,
      status: 'connected',
      menuItems: []
    });

    res.status(201).json({
      message: `Successfully connected to ${platform}`,
      integration: {
        id: integration._id,
        restaurantId: integration.restaurantId,
        platform: integration.platform,
        status: integration.status,
        connectedAt: integration.createdAt
      }
    });
  } catch (error: any) {
    console.error('Connect platform error:', error);
    res.status(500).json({ error: error.message || 'Failed to connect platform' });
  }
};

/**
 * Sync menu to delivery platform (add low-oil badges)
 */
export const syncMenu = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const schema = Joi.object({
      menuItems: Joi.array().items(
        Joi.object({
          name: Joi.string().required(),
          oilAmount: Joi.number().min(0).required(),
          category: Joi.string().optional(),
          price: Joi.number().min(0).optional()
        })
      ).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const integration = await DeliveryIntegration.findById(id);
    if (!integration) {
      return res.status(404).json({ error: 'Integration not found' });
    }

    // Update status
    integration.status = 'syncing';
    await integration.save();

    // Sync via mock adapter
    const adapter = new MockDeliveryAdapter(integration.platform, integration.restaurantId);
    const syncResult = await adapter.syncMenu(req.body.menuItems);

    if (!syncResult.success) {
      integration.status = 'error';
      integration.syncErrors = integration.syncErrors || [];
      integration.syncErrors.push(syncResult.message || 'Sync failed');
      await integration.save();

      return res.status(502).json({ error: syncResult.message });
    }

    // Update menu items with low-oil badges
    const processedItems = req.body.menuItems.map((item: any) => ({
      name: item.name,
      oilAmount: item.oilAmount,
      lowOilBadge: item.oilAmount < 15, // < 15ml per serving
      category: item.category,
      price: item.price,
      syncedAt: new Date()
    }));

    integration.menuItems = processedItems;
    integration.status = 'connected';
    integration.lastSyncAt = new Date();
    integration.syncErrors = [];
    await integration.save();

    const lowOilCount = processedItems.filter((item: any) => item.lowOilBadge).length;

    res.json({
      message: 'Menu synced successfully',
      result: {
        platformMenuId: syncResult.platformMenuId,
        totalItems: processedItems.length,
        lowOilItems: lowOilCount,
        lowOilPercentage: Math.round((lowOilCount / processedItems.length) * 100),
        lastSyncAt: integration.lastSyncAt
      }
    });
  } catch (error: any) {
    console.error('Sync menu error:', error);
    res.status(500).json({ error: error.message || 'Failed to sync menu' });
  }
};

/**
 * Get analytics for restaurant integration
 */
export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const { days = 30 } = req.query;

    const integrations = await DeliveryIntegration.find({ restaurantId });
    if (integrations.length === 0) {
      return res.status(404).json({ error: 'No integrations found for restaurant' });
    }

    const analyticsPromises = integrations.map(async (integration) => {
      const adapter = new MockDeliveryAdapter(integration.platform, restaurantId);
      const analytics = await adapter.getAnalytics(Number(days));

      return {
        platform: integration.platform,
        status: integration.status,
        ...analytics,
        menuItems: {
          total: integration.menuItems.length,
          lowOil: integration.menuItems.filter(item => item.lowOilBadge).length
        },
        lastSyncAt: integration.lastSyncAt
      };
    });

    const analytics = await Promise.all(analyticsPromises);

    // Calculate totals
    const totals = analytics.reduce(
      (acc, curr) => ({
        totalOrders: acc.totalOrders + curr.totalOrders,
        lowOilOrders: acc.lowOilOrders + curr.lowOilOrders
      }),
      { totalOrders: 0, lowOilOrders: 0 }
    );

    res.json({
      restaurantId,
      period: `Last ${days} days`,
      platforms: analytics,
      summary: {
        ...totals,
        overallLowOilPercentage: totals.totalOrders > 0 
          ? Math.round((totals.lowOilOrders / totals.totalOrders) * 100)
          : 0,
        platformCount: integrations.length
      }
    });
  } catch (error: any) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: error.message || 'Failed to get analytics' });
  }
};

/**
 * Simulate webhook for order simulation
 */
export const simulateWebhook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const integration = await DeliveryIntegration.findById(id);
    if (!integration) {
      return res.status(404).json({ error: 'Integration not found' });
    }

    const adapter = new MockDeliveryAdapter(integration.platform, integration.restaurantId);
    const webhookPayload = adapter.generateMockWebhook();

    // Update analytics
    integration.analytics.totalOrders += 1;
    const orderItems = webhookPayload.items;
    const hasLowOilItem = orderItems.some((item: any) => item.oilAmount < 15);
    if (hasLowOilItem) {
      integration.analytics.lowOilOrders += 1;
    }
    integration.analytics.lastOrderAt = new Date();
    await integration.save();

    res.json({
      message: 'Webhook simulated successfully',
      webhook: webhookPayload,
      analytics: integration.analytics
    });
  } catch (error: any) {
    console.error('Simulate webhook error:', error);
    res.status(500).json({ error: error.message || 'Failed to simulate webhook' });
  }
};

/**
 * Get all integrations for a restaurant
 */
export const getIntegrations = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;

    const integrations = await DeliveryIntegration.find({ restaurantId });

    res.json({
      restaurantId,
      integrations: integrations.map(int => ({
        id: int._id,
        platform: int.platform,
        status: int.status,
        menuItemCount: int.menuItems.length,
        lowOilItemCount: int.menuItems.filter(item => item.lowOilBadge).length,
        lastSyncAt: int.lastSyncAt,
        analytics: int.analytics
      }))
    });
  } catch (error: any) {
    console.error('Get integrations error:', error);
    res.status(500).json({ error: error.message || 'Failed to get integrations' });
  }
};

/**
 * Disconnect from delivery platform
 */
export const disconnectPlatform = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const integration = await DeliveryIntegration.findById(id);
    if (!integration) {
      return res.status(404).json({ error: 'Integration not found' });
    }

    integration.status = 'disconnected';
    await integration.save();

    res.json({
      message: `Disconnected from ${integration.platform}`,
      integration: {
        id: integration._id,
        platform: integration.platform,
        status: integration.status
      }
    });
  } catch (error: any) {
    console.error('Disconnect platform error:', error);
    res.status(500).json({ error: error.message || 'Failed to disconnect platform' });
  }
};
