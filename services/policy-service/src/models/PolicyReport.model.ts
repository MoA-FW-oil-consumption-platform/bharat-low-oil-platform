import mongoose, { Document, Schema } from 'mongoose';

export interface IPolicyReport extends Document {
  reportId: string;
  reportType: 'gst_simulation' | 'national_impact' | 'state_comparison' | 'ministerial_summary';
  period: {
    startDate: Date;
    endDate: Date;
    description: string;
  };
  generatedBy: string; // User ID
  metrics: {
    totalUsers: number;
    avgReduction: number;
    estimatedImportSavings: number;
    healthcareCostAverted: number;
    gstRevenueImpact: number;
    carbonEmissionReduced: number;
  };
  stateData?: Array<{
    state: string;
    users: number;
    avgReduction: number;
    rank?: number;
  }>;
  gstSimulation?: {
    currentRevenue: number;
    projectedRevenue: number;
    revenueDifference: number;
    percentageChange: number;
  };
  recommendations: string[];
  pdfUrl?: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const PolicyReportSchema = new Schema<IPolicyReport>(
  {
    reportId: { type: String, required: true, unique: true, index: true },
    reportType: {
      type: String,
      enum: ['gst_simulation', 'national_impact', 'state_comparison', 'ministerial_summary'],
      required: true
    },
    period: {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      description: { type: String, required: true }
    },
    generatedBy: { type: String, required: true },
    metrics: {
      totalUsers: { type: Number, required: true },
      avgReduction: { type: Number, required: true },
      estimatedImportSavings: { type: Number, required: true },
      healthcareCostAverted: { type: Number, required: true },
      gstRevenueImpact: { type: Number, required: true },
      carbonEmissionReduced: { type: Number, required: true }
    },
    stateData: [
      {
        state: { type: String },
        users: { type: Number },
        avgReduction: { type: Number },
        rank: { type: Number }
      }
    ],
    gstSimulation: {
      currentRevenue: { type: Number },
      projectedRevenue: { type: Number },
      revenueDifference: { type: Number },
      percentageChange: { type: Number }
    },
    recommendations: [{ type: String }],
    pdfUrl: { type: String },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft'
    }
  },
  { timestamps: true }
);

// Index for querying reports by type and period
PolicyReportSchema.index({ reportType: 1, 'period.startDate': -1 });

export default mongoose.model<IPolicyReport>('PolicyReport', PolicyReportSchema);
