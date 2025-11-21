// User Types
export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  familySize?: number;
  dietaryPreferences?: string[];
  healthGoals?: string[];
  preferredLanguage: 'en' | 'hi' | 'ta';
  location?: Location;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  state: string;
  district: string;
  city?: string;
  pincode?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Oil Tracking Types
export interface OilLog {
  id: string;
  userId: string;
  amount: number; // in ml
  oilType: OilType;
  consumptionType: 'cooking' | 'frying' | 'baking' | 'salad' | 'other';
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  deviceId?: string;
  timestamp: Date;
  notes?: string;
}

export type OilType = 
  | 'sunflower'
  | 'mustard'
  | 'groundnut'
  | 'coconut'
  | 'olive'
  | 'rice_bran'
  | 'palm'
  | 'soybean'
  | 'other';

export interface OilConsumptionStats {
  totalConsumption: number;
  dailyAverage: number;
  weeklyAverage: number;
  monthlyAverage: number;
  comparisonToICMR: number; // percentage above/below recommended
  trend: 'increasing' | 'decreasing' | 'stable';
}

// Reward Types
export interface UserReward {
  id: string;
  userId: string;
  points: number;
  level: number;
  badges: Badge[];
  achievements: Achievement[];
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  category: 'milestone' | 'streak' | 'reduction' | 'social';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
  reward: number; // points
}

// Recipe Types
export interface Recipe {
  id: string;
  name: string;
  nameHindi?: string;
  nameTamil?: string;
  description: string;
  descriptionHindi?: string;
  descriptionTamil?: string;
  oilAmount: number; // in ml
  cuisine: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prepTime: number; // in minutes
  cookTime: number;
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  nutritionInfo: NutritionInfo;
  tags: string[];
  imageUrl?: string;
  videoUrl?: string;
  ratings: number;
  views: number;
  isLowOil: boolean; // < 20ml per serving
}

export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sodium: number;
}

// Restaurant Types
export interface Restaurant {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  contactEmail: string;
  contactPhone: string;
  address: Address;
  certificationStatus: CertificationStatus;
  certificateId?: string;
  certificationLevel?: 'bronze' | 'silver' | 'gold';
  complianceScore?: number;
  menu: MenuItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

export type CertificationStatus = 
  | 'not_applied'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'expired'
  | 'suspended';

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  oilAmount: number; // in ml
  isLowOil: boolean;
  imageUrl?: string;
  available: boolean;
}

export interface CertificationApplication {
  id: string;
  restaurantId: string;
  applicantName: string;
  applicantEmail: string;
  businessLicense?: string;
  fssaiLicense?: string;
  menuProof: string[];
  oilUsageDeclaration: string;
  status: CertificationStatus;
  reviewNotes?: string;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

// Campaign Types
export interface Campaign {
  id: string;
  title: string;
  titleHindi?: string;
  titleTamil?: string;
  description: string;
  descriptionHindi?: string;
  descriptionTamil?: string;
  type: 'challenge' | 'awareness' | 'competition' | 'education';
  targetReduction: number; // percentage
  rewardPoints: number;
  startDate: Date;
  endDate: Date;
  participants: string[]; // user IDs
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  imageUrl?: string;
  rules?: string[];
  createdBy: string;
}

// Analytics Types
export interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalConsumption: number;
  averageReduction: number;
  topStates: StateStats[];
  trends: ConsumptionTrend[];
  demographics: DemographicBreakdown;
}

export interface StateStats {
  state: string;
  totalUsers: number;
  averageConsumption: number;
  reduction: number;
}

export interface ConsumptionTrend {
  date: string;
  actual: number;
  target: number;
  reduction: number;
}

export interface DemographicBreakdown {
  byAge: AgeGroupStats[];
  byGender: GenderStats[];
  byFamilySize: FamilySizeStats[];
}

export interface AgeGroupStats {
  ageGroup: string;
  count: number;
  averageConsumption: number;
}

export interface GenderStats {
  gender: string;
  count: number;
  averageConsumption: number;
}

export interface FamilySizeStats {
  familySize: number;
  count: number;
  averageConsumption: number;
}

// AI/ML Types
export interface PredictionRequest {
  userId: string;
  daysAhead: number; // 1-90
}

export interface PredictionResponse {
  userId: string;
  predictions: DailyPrediction[];
  confidence: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  recommendedTarget: number;
}

export interface DailyPrediction {
  date: string;
  predictedConsumption: number;
  confidence: number;
}

export interface RecommendationRequest {
  userId: string;
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  cuisine?: string;
  maxOilAmount?: number;
}

export interface RecommendationResponse {
  recipes: ScoredRecipe[];
  personalizedMessage: string;
}

export interface ScoredRecipe extends Recipe {
  score: number;
  matchReasons: string[];
}

export interface InsightsResponse {
  userId: string;
  currentConsumption: number;
  icmrRecommendation: number;
  comparisonPercentage: number;
  healthStatus: 'healthy' | 'moderate' | 'high_risk';
  trend: 'improving' | 'stable' | 'worsening';
  suggestions: string[];
  achievements: string[];
}

// Blockchain Types
export interface BlockchainCertificate {
  certificateId: string;
  restaurantOwner: string;
  restaurantName: string;
  location: string;
  contactEmail: string;
  level: 'bronze' | 'silver' | 'gold';
  status: 'pending' | 'active' | 'expired' | 'revoked' | 'suspended';
  issueDate: number; // timestamp
  expiryDate: number; // timestamp
  complianceScore: number;
  metadataURI: string;
  issuedBy: string;
  lastUpdated: number;
}

export interface CertificateVerification {
  isValid: boolean;
  certificate?: BlockchainCertificate;
  message: string;
}

// IoT Types
export interface WeightSensorData {
  deviceId: string;
  weight: number;
  unit: 'ml' | 'grams';
  timestamp: string;
}

export interface DeviceStatus {
  deviceId: string;
  status: 'online' | 'offline' | 'error';
  timestamp: string;
}

export interface DeviceAlert {
  deviceId: string;
  alertType: 'low_level' | 'refill_detected' | 'empty' | 'error';
  message: string;
  currentWeight: number;
  timestamp: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Export constants
export * from './constants';

// Auth Types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin' | 'verifier' | 'restaurant';
  iat: number;
  exp: number;
}
