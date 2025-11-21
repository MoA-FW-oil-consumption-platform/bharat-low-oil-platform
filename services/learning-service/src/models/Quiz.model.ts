import mongoose, { Document, Schema } from 'mongoose';

interface IQuestion {
  question: string;
  questionHindi?: string;
  questionTamil?: string;
  questionBengali?: string;
  questionTelugu?: string;
  options: string[];
  optionsHindi?: string[];
  optionsTamil?: string[];
  optionsBengali?: string[];
  optionsTelugu?: string[];
  correctAnswer: number; // index of correct option
  explanation?: string;
  explanationHindi?: string;
  explanationTamil?: string;
  explanationBengali?: string;
  explanationTelugu?: string;
  points: number;
}

export interface IQuiz extends Document {
  moduleId: string;
  title: string;
  titleHindi?: string;
  titleTamil?: string;
  titleBengali?: string;
  titleTelugu?: string;
  description?: string;
  questions: IQuestion[];
  passingScore: number; // percentage
  timeLimit?: number; // in minutes
  maxAttempts?: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  question: { type: String, required: true },
  questionHindi: { type: String },
  questionTamil: { type: String },
  questionBengali: { type: String },
  questionTelugu: { type: String },
  options: [{ type: String, required: true }],
  optionsHindi: [{ type: String }],
  optionsTamil: [{ type: String }],
  optionsBengali: [{ type: String }],
  optionsTelugu: [{ type: String }],
  correctAnswer: { type: Number, required: true },
  explanation: { type: String },
  explanationHindi: { type: String },
  explanationTamil: { type: String },
  explanationBengali: { type: String },
  explanationTelugu: { type: String },
  points: { type: Number, default: 10 }
});

const QuizSchema = new Schema<IQuiz>(
  {
    moduleId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    titleHindi: { type: String },
    titleTamil: { type: String },
    titleBengali: { type: String },
    titleTelugu: { type: String },
    description: { type: String },
    questions: [QuestionSchema],
    passingScore: { type: Number, default: 70 },
    timeLimit: { type: Number },
    maxAttempts: { type: Number, default: 3 },
    shuffleQuestions: { type: Boolean, default: true },
    shuffleOptions: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model<IQuiz>('Quiz', QuizSchema);
