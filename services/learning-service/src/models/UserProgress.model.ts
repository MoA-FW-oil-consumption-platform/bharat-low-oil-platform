import mongoose, { Document, Schema } from 'mongoose';

interface IQuizAttempt {
  attemptNumber: number;
  score: number;
  totalPoints: number;
  percentage: number;
  answers: Array<{
    questionIndex: number;
    selectedOption: number;
    isCorrect: boolean;
    pointsEarned: number;
  }>;
  startedAt: Date;
  completedAt: Date;
  passed: boolean;
}

export interface IUserProgress extends Document {
  userId: string;
  moduleId: string;
  status: 'not_started' | 'in_progress' | 'quiz_required' | 'completed' | 'failed';
  lessonsCompleted: string[];
  videoWatchTime: number; // in seconds
  quizAttempts: IQuizAttempt[];
  bestScore?: number;
  certificateId?: string;
  certificateIssuedAt?: Date;
  startedAt: Date;
  completedAt?: Date;
  lastAccessedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const QuizAttemptSchema = new Schema<IQuizAttempt>({
  attemptNumber: { type: Number, required: true },
  score: { type: Number, required: true },
  totalPoints: { type: Number, required: true },
  percentage: { type: Number, required: true },
  answers: [{
    questionIndex: { type: Number, required: true },
    selectedOption: { type: Number, required: true },
    isCorrect: { type: Boolean, required: true },
    pointsEarned: { type: Number, required: true }
  }],
  startedAt: { type: Date, required: true },
  completedAt: { type: Date, required: true },
  passed: { type: Boolean, required: true }
});

const UserProgressSchema = new Schema<IUserProgress>(
  {
    userId: { type: String, required: true, index: true },
    moduleId: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'quiz_required', 'completed', 'failed'],
      default: 'not_started'
    },
    lessonsCompleted: [{ type: String }],
    videoWatchTime: { type: Number, default: 0 },
    quizAttempts: [QuizAttemptSchema],
    bestScore: { type: Number },
    certificateId: { type: String },
    certificateIssuedAt: { type: Date },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    lastAccessedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Compound index for unique user-module combination
UserProgressSchema.index({ userId: 1, moduleId: 1 }, { unique: true });

export default mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);
