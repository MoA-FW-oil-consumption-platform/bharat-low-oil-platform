import mongoose, { Document, Schema } from 'mongoose';

export interface IOilLog extends Document {
  userId: string;
  amount: number;
  oilType: string;
  date: Date;
  source: 'manual' | 'iot' | 'barcode';
  notes?: string;
  deviceId?: string;
  createdAt: Date;
}

const OilLogSchema = new Schema<IOilLog>(
  {
    userId: { type: String, required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    oilType: { 
      type: String, 
      required: true,
      enum: ['sunflower', 'palm', 'mustard', 'groundnut', 'coconut', 'olive', 'other']
    },
    date: { type: Date, required: true, default: Date.now },
    source: { 
      type: String, 
      required: true, 
      enum: ['manual', 'iot', 'barcode'],
      default: 'manual'
    },
    notes: { type: String },
    deviceId: { type: String }
  },
  { timestamps: true }
);

// Index for efficient queries
OilLogSchema.index({ userId: 1, date: -1 });

export default mongoose.model<IOilLog>('OilLog', OilLogSchema);
