import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IPartnerAuth extends Document {
  partnerId: string;
  restaurantId: string;
  restaurantName: string;
  apiKey: string;
  apiKeyHashed: string;
  permissions: string[];
  rateLimit: number;
  isActive: boolean;
  lastUsedAt?: Date;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
  compareApiKey(candidateKey: string): Promise<boolean>;
}

const PartnerAuthSchema = new Schema<IPartnerAuth>(
  {
    partnerId: { type: String, required: true, unique: true, index: true },
    restaurantId: { type: String, required: true, index: true },
    restaurantName: { type: String, required: true },
    apiKey: { type: String }, // Plain text, shown only once during creation
    apiKeyHashed: { type: String, required: true },
    permissions: [{
      type: String,
      enum: ['menu:read', 'menu:write', 'cert:read', 'orders:read', 'webhook:manage']
    }],
    rateLimit: { type: Number, default: 100 }, // requests per 15 minutes
    isActive: { type: Boolean, default: true },
    lastUsedAt: { type: Date },
    usageCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Hash API key before saving
PartnerAuthSchema.pre('save', async function(next) {
  if (!this.isModified('apiKeyHashed')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.apiKeyHashed = await bcrypt.hash(this.apiKeyHashed, salt);
  next();
});

// Method to compare API key
PartnerAuthSchema.methods.compareApiKey = async function(candidateKey: string): Promise<boolean> {
  return bcrypt.compare(candidateKey, this.apiKeyHashed);
};

export default mongoose.model<IPartnerAuth>('PartnerAuth', PartnerAuthSchema);
