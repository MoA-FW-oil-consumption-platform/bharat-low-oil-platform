import mongoose, { Document, Schema } from 'mongoose';

export interface IBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

export interface IReward extends Document {
  userId: string;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  lastLogDate?: Date;
  badges: IBadge[];
  achievements: string[];
  pointsHistory: Array<{
    points: number;
    reason: string;
    date: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const BadgeSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  earnedAt: { type: Date, default: Date.now }
});

const RewardSchema = new Schema<IReward>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    totalPoints: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastLogDate: { type: Date },
    badges: [BadgeSchema],
    achievements: [{ type: String }],
    pointsHistory: [{
      points: { type: Number, required: true },
      reason: { type: String, required: true },
      date: { type: Date, default: Date.now }
    }]
  },
  { timestamps: true }
);

export default mongoose.model<IReward>('Reward', RewardSchema);
