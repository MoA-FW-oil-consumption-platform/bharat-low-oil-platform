import mongoose, { Document, Schema } from 'mongoose';

export interface IModule extends Document {
  title: string;
  titleHindi?: string;
  titleTamil?: string;
  titleBengali?: string;
  titleTelugu?: string;
  description: string;
  descriptionHindi?: string;
  descriptionTamil?: string;
  descriptionBengali?: string;
  descriptionTelugu?: string;
  content: string;
  contentHindi?: string;
  contentTamil?: string;
  contentBengali?: string;
  contentTelugu?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  quizId?: string;
  targetAudience: 'school' | 'community' | 'institutional' | 'mdm' | 'general';
  ageGroup?: string;
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];
  learningObjectives: string[];
  topics: string[];
  order: number;
  isPublished: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const ModuleSchema = new Schema<IModule>(
  {
    title: { type: String, required: true, index: true },
    titleHindi: { type: String },
    titleTamil: { type: String },
    titleBengali: { type: String },
    titleTelugu: { type: String },
    description: { type: String, required: true },
    descriptionHindi: { type: String },
    descriptionTamil: { type: String },
    descriptionBengali: { type: String },
    descriptionTelugu: { type: String },
    content: { type: String, required: true },
    contentHindi: { type: String },
    contentTamil: { type: String },
    contentBengali: { type: String },
    contentTelugu: { type: String },
    videoUrl: { type: String },
    thumbnailUrl: { type: String },
    quizId: { type: String, index: true },
    targetAudience: {
      type: String,
      enum: ['school', 'community', 'institutional', 'mdm', 'general'],
      required: true,
      index: true
    },
    ageGroup: { type: String },
    duration: { type: Number, required: true },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    prerequisites: [{ type: String }],
    learningObjectives: [{ type: String }],
    topics: [{ type: String }],
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IModule>('Module', ModuleSchema);
