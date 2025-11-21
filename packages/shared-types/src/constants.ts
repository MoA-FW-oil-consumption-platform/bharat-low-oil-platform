// Constants
export const ICMR_RECOMMENDED_OIL = 1000; // ml per person per month
export const ICMR_DAILY_LIMIT = 33; // ml per person per day

export const OIL_TYPES = [
  'sunflower',
  'mustard',
  'groundnut',
  'coconut',
  'olive',
  'rice_bran',
  'palm',
  'soybean',
  'other',
] as const;

export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

export const CONSUMPTION_TYPES = [
  'cooking',
  'frying',
  'baking',
  'salad',
  'other',
] as const;

export const LANGUAGES = ['en', 'hi', 'ta'] as const;

export const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'] as const;

export const CERTIFICATION_LEVELS = ['bronze', 'silver', 'gold'] as const;

export const BADGE_CATEGORIES = [
  'milestone',
  'streak',
  'reduction',
  'social',
] as const;

export const CAMPAIGN_TYPES = [
  'challenge',
  'awareness',
  'competition',
  'education',
] as const;

// Points and Rewards
export const POINTS = {
  LOG_CONSUMPTION: 5,
  DAILY_STREAK: 10,
  WEEKLY_STREAK: 50,
  MONTHLY_STREAK: 200,
  MEET_DAILY_TARGET: 20,
  REDUCE_BY_10_PERCENT: 50,
  REDUCE_BY_20_PERCENT: 100,
  REDUCE_BY_30_PERCENT: 200,
  SHARE_RECIPE: 15,
  RATE_RECIPE: 5,
  COMPLETE_ACHIEVEMENT: 100,
  CAMPAIGN_PARTICIPATION: 25,
} as const;

// Compliance Score Thresholds
export const COMPLIANCE = {
  MIN_SCORE: 70,
  BRONZE_THRESHOLD: 70,
  SILVER_THRESHOLD: 80,
  GOLD_THRESHOLD: 90,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
    VERIFY: '/api/auth/verify',
  },
  USER: {
    PROFILE: '/api/user/profile',
    UPDATE: '/api/user/update',
    DELETE: '/api/user/delete',
    PREFERENCES: '/api/user/preferences',
  },
  TRACKING: {
    LOGS: '/api/tracking/logs',
    LOG: '/api/tracking/log',
    STATS: '/api/tracking/stats',
    TRENDS: '/api/tracking/trends',
  },
  REWARDS: {
    POINTS: '/api/rewards/points',
    BADGES: '/api/rewards/badges',
    ACHIEVEMENTS: '/api/rewards/achievements',
    LEADERBOARD: '/api/rewards/leaderboard',
  },
  AI: {
    PREDICT: '/api/ai/predictions/consumption',
    RECOMMEND: '/api/ai/recommendations/recipes',
    INSIGHTS: '/api/ai/insights/user',
    NATIONAL: '/api/ai/insights/national',
  },
  RECIPES: {
    LIST: '/api/recipes',
    DETAIL: '/api/recipes/:id',
    SEARCH: '/api/recipes/search',
    POPULAR: '/api/recipes/popular',
    LOW_OIL: '/api/recipes/low-oil',
  },
  RESTAURANTS: {
    LIST: '/api/restaurants',
    DETAIL: '/api/restaurants/:id',
    MENU: '/api/restaurants/:id/menu',
    CERTIFICATION: '/api/restaurants/certification',
    VERIFY: '/api/restaurants/verify/:certificateId',
  },
  CAMPAIGNS: {
    LIST: '/api/campaigns',
    DETAIL: '/api/campaigns/:id',
    PARTICIPATE: '/api/campaigns/:id/participate',
    LEADERBOARD: '/api/campaigns/:id/leaderboard',
  },
  ADMIN: {
    USERS: '/api/admin/users',
    ANALYTICS: '/api/admin/analytics',
    CAMPAIGNS: '/api/admin/campaigns',
    RESTAURANTS: '/api/admin/restaurants',
    CERTIFICATIONS: '/api/admin/certifications',
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'Unauthorized access',
    TOKEN_EXPIRED: 'Token has expired',
    INVALID_TOKEN: 'Invalid token',
  },
  USER: {
    NOT_FOUND: 'User not found',
    ALREADY_EXISTS: 'User already exists',
    INVALID_DATA: 'Invalid user data',
  },
  TRACKING: {
    INVALID_AMOUNT: 'Invalid oil amount',
    LOG_NOT_FOUND: 'Oil log not found',
  },
  RESTAURANT: {
    NOT_FOUND: 'Restaurant not found',
    INVALID_CERTIFICATION: 'Invalid certification data',
  },
  GENERAL: {
    SERVER_ERROR: 'Internal server error',
    VALIDATION_ERROR: 'Validation error',
    NOT_FOUND: 'Resource not found',
  },
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  AUTH: {
    LOGIN: 'Login successful',
    REGISTER: 'Registration successful',
    LOGOUT: 'Logout successful',
  },
  USER: {
    UPDATED: 'Profile updated successfully',
    DELETED: 'Account deleted successfully',
  },
  TRACKING: {
    LOGGED: 'Oil consumption logged successfully',
    UPDATED: 'Oil log updated successfully',
    DELETED: 'Oil log deleted successfully',
  },
  RESTAURANT: {
    CREATED: 'Restaurant created successfully',
    UPDATED: 'Restaurant updated successfully',
    CERTIFICATION_APPLIED: 'Certification application submitted',
  },
  GENERAL: {
    SUCCESS: 'Operation successful',
  },
} as const;
