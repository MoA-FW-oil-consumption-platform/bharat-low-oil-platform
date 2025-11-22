import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  userId: string;
  email: string;
  fullName: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  familySize: number;
  region?: string;
  dietaryHabit?: 'vegetarian' | 'non-vegetarian';
  healthConditions?: string[];
  monthlyOilConsumption?: number;
  streak?: number;
  points?: number;
  preferences: {
    language: string;
    notifications: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    userId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    age: { type: Number },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    familySize: { type: Number, required: true, default: 1 },
    region: { type: String },
    dietaryHabit: { type: String, enum: ['vegetarian', 'non-vegetarian'] },
    healthConditions: [{ type: String }],
    monthlyOilConsumption: { type: Number },
    streak: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    preferences: {
      language: { type: String, default: 'en' },
      notifications: { type: Boolean, default: true }
    }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
