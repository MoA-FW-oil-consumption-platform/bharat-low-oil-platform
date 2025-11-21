import mongoose, { Document, Schema } from 'mongoose';

export interface IInstitutionalLog extends Document {
  institutionId: mongoose.Types.ObjectId;
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  mealsServed: number;
  oilUsed: number; // Total oil in ml
  oilPerMeal: number; // Calculated: oilUsed / mealsServed
  staffId: mongoose.Types.ObjectId; // Staff who logged
  ingredients?: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InstitutionalLogSchema = new Schema<IInstitutionalLog>(
  {
    institutionId: { type: Schema.Types.ObjectId, required: true, index: true },
    date: { type: Date, required: true, index: true },
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snacks'],
      required: true
    },
    mealsServed: { type: Number, required: true, min: 1 },
    oilUsed: { type: Number, required: true, min: 0 },
    oilPerMeal: { type: Number, required: true },
    staffId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ingredients: [{ type: String }],
    notes: { type: String }
  },
  { timestamps: true }
);

// Index for monthly aggregations
InstitutionalLogSchema.index({ institutionId: 1, date: -1 });
InstitutionalLogSchema.index({ date: 1, mealType: 1 });

// Pre-save hook to calculate oil per meal
InstitutionalLogSchema.pre('save', function(next) {
  if (this.mealsServed > 0) {
    this.oilPerMeal = Number((this.oilUsed / this.mealsServed).toFixed(2));
  }
  next();
});

export default mongoose.model<IInstitutionalLog>('InstitutionalLog', InstitutionalLogSchema);
