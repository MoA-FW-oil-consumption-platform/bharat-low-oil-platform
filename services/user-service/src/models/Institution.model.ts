import mongoose, { Document, Schema } from 'mongoose';

export interface IInstitution extends Document {
  type: 'school' | 'hospital' | 'canteen' | 'mdm_scheme';
  name: string;
  registrationNumber: string;
  district: string;
  state: string;
  managerId: mongoose.Types.ObjectId; // References User
  contactEmail: string;
  contactPhone?: string;
  capacity: number; // Number of people served daily
  mealsPerDay: number; // Number of meals served per day
  complianceReports: Array<{
    month: string; // YYYY-MM format
    status: 'compliant' | 'non-compliant' | 'pending';
    avgOilPerMeal: number;
    icmrLimit: number;
    reportUrl?: string;
    generatedAt: Date;
  }>;
  settings: {
    mealTypes: ('breakfast' | 'lunch' | 'dinner' | 'snacks')[];
    operatingDays: number; // Days per month
    icmrPerMealLimit: number; // ml per meal
  };
  isActive: boolean;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InstitutionSchema = new Schema<IInstitution>(
  {
    type: {
      type: String,
      enum: ['school', 'hospital', 'canteen', 'mdm_scheme'],
      required: true,
      index: true
    },
    name: { type: String, required: true },
    registrationNumber: { type: String, required: true, unique: true, index: true },
    district: { type: String, required: true, index: true },
    state: { type: String, required: true, index: true },
    managerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String },
    capacity: { type: Number, required: true, min: 10 },
    mealsPerDay: { type: Number, required: true, min: 1, max: 4 },
    complianceReports: [
      {
        month: { type: String, required: true },
        status: {
          type: String,
          enum: ['compliant', 'non-compliant', 'pending'],
          default: 'pending'
        },
        avgOilPerMeal: { type: Number, required: true },
        icmrLimit: { type: Number, required: true },
        reportUrl: { type: String },
        generatedAt: { type: Date, default: Date.now }
      }
    ],
    settings: {
      mealTypes: [{
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'snacks']
      }],
      operatingDays: { type: Number, default: 26 }, // ~26 working days per month
      icmrPerMealLimit: { type: Number, default: 20 } // 20ml per meal (ICMR recommendation)
    },
    isActive: { type: Boolean, default: true },
    verifiedAt: { type: Date }
  },
  { timestamps: true }
);

// Index for district-level aggregations
InstitutionSchema.index({ district: 1, state: 1, type: 1 });

export default mongoose.model<IInstitution>('Institution', InstitutionSchema);
