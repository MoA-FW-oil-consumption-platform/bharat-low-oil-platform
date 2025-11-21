import mongoose, { Document, Schema } from 'mongoose';

interface IMenuItem {
  externalId?: string;
  name: string;
  oilAmount: number;
  lowOilBadge: boolean;
  category?: string;
  price?: number;
  syncedAt: Date;
}

export interface IDeliveryIntegration extends Document {
  restaurantId: string;
  restaurantName: string;
  platform: 'swiggy' | 'zomato' | 'ubereats';
  status: 'connected' | 'syncing' | 'error' | 'disconnected';
  mockApiKey: string;
  webhookUrl?: string;
  menuItems: IMenuItem[];
  lastSyncAt?: Date;
  syncErrors?: string[];
  analytics: {
    totalOrders: number;
    lowOilOrders: number;
    lastOrderAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema = new Schema<IMenuItem>({
  externalId: { type: String },
  name: { type: String, required: true },
  oilAmount: { type: Number, required: true },
  lowOilBadge: { type: Boolean, default: false },
  category: { type: String },
  price: { type: Number },
  syncedAt: { type: Date, default: Date.now }
});

const DeliveryIntegrationSchema = new Schema<IDeliveryIntegration>(
  {
    restaurantId: { type: String, required: true, index: true },
    restaurantName: { type: String, required: true },
    platform: {
      type: String,
      enum: ['swiggy', 'zomato', 'ubereats'],
      required: true
    },
    status: {
      type: String,
      enum: ['connected', 'syncing', 'error', 'disconnected'],
      default: 'connected'
    },
    mockApiKey: { type: String, required: true },
    webhookUrl: { type: String },
    menuItems: [MenuItemSchema],
    lastSyncAt: { type: Date },
    syncErrors: [{ type: String }],
    analytics: {
      totalOrders: { type: Number, default: 0 },
      lowOilOrders: { type: Number, default: 0 },
      lastOrderAt: { type: Date }
    }
  },
  { timestamps: true }
);

// Index for unique restaurant-platform combination
DeliveryIntegrationSchema.index({ restaurantId: 1, platform: 1 }, { unique: true });

export default mongoose.model<IDeliveryIntegration>('DeliveryIntegration', DeliveryIntegrationSchema);
