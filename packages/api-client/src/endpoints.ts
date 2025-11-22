/**
 * API Endpoints
 * Centralized endpoint definitions matching backend routes
 */

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    VERIFY: '/api/auth/verify',
    ME: '/api/auth/me',
    OAUTH_INITIATE: '/api/auth/oauth/initiate',
    OAUTH_CALLBACK: '/api/auth/oauth/callback',
  },

  // User endpoints
  USER: {
    PROFILE: (userId: string) => `/api/users/${userId}`,
    UPDATE: (userId: string) => `/api/users/${userId}`,
    DELETE: (userId: string) => `/api/users/${userId}`,
    CREATE: '/api/users',
    SAVED_RECIPES: (userId: string) => `/api/users/${userId}/saved-recipes`,
    NOTIFICATION_TOKEN: (userId: string) => `/api/users/${userId}/notification-token`,
    STATS: '/api/users/stats',
  },

  // Tracking endpoints
  TRACKING: {
    LOGS: '/api/tracking/logs',
    LOG_BY_USER: (userId: string) => `/api/tracking/logs/${userId}`,
    CREATE_LOG: '/api/tracking/logs',
    DELETE_LOG: (logId: string) => `/api/tracking/logs/${logId}`,
    MONTHLY_USAGE: (userId: string) => `/api/tracking/usage/${userId}/monthly`,
    STATS: (userId: string) => `/api/tracking/stats/${userId}`,
    TRENDS: '/api/tracking/trends',
    BY_REGION: '/api/tracking/by-region',
    HEATMAP: '/api/tracking/heatmap',
    NATIONAL_STATS: '/api/tracking/stats/national',
  },

  // Rewards endpoints
  REWARDS: {
    GET: (userId: string) => `/api/rewards/${userId}`,
    ADD_POINTS: (userId: string) => `/api/rewards/${userId}/points`,
    UPDATE_STREAK: (userId: string) => `/api/rewards/${userId}/streak`,
    AWARD_BADGE: (userId: string) => `/api/rewards/${userId}/badge`,
    POINTS_HISTORY: (userId: string) => `/api/rewards/${userId}/points`,
    BADGES: (userId: string) => `/api/rewards/${userId}/badges`,
    ACHIEVEMENTS: (userId: string) => `/api/rewards/${userId}/achievements`,
    LEADERBOARD: '/api/rewards/leaderboard',
  },

  // AI/Recipe endpoints
  AI: {
    RECOMMENDATIONS: '/api/ai/recommendations/recipes',
    POPULAR: '/api/ai/recommendations/popular',
    BARCODE: '/api/ai/barcode/analyze',
    NUTRITION: '/api/ai/nutrition/analyze',
    ANALYZE_FOOD: '/api/ai/analyze-food',
    MEAL_SUGGESTIONS: '/api/ai/meal-suggestions',
    CHAT: '/api/ai/chat',
    HEALTH_SCORE: (userId: string) => `/api/ai/health-score/${userId}`,
  },

  // Learning endpoints
  LEARNING: {
    MODULES: '/api/learning/modules',
    MODULE_BY_ID: (moduleId: string) => `/api/learning/modules/${moduleId}`,
    MODULE_STATS: '/api/learning/modules/stats',
    CREATE_MODULE: '/api/learning/modules',
    UPDATE_MODULE: (moduleId: string) => `/api/learning/modules/${moduleId}`,
    DELETE_MODULE: (moduleId: string) => `/api/learning/modules/${moduleId}`,
    START_MODULE: (moduleId: string) => `/api/learning/progress/${moduleId}/start`,
    UPDATE_PROGRESS: (moduleId: string) => `/api/learning/progress/${moduleId}`,
    SUBMIT_QUIZ: '/api/learning/quizzes/submit',
    USER_PROGRESS: (userId: string) => `/api/learning/progress/${userId}`,
    PROGRESS_STATS: '/api/learning/progress/stats',
    GENERATE_CERTIFICATE: (moduleId: string) => `/api/learning/certificates/${moduleId}/generate`,
    GET_CERTIFICATE: (moduleId: string) => `/api/learning/certificates/${moduleId}`,
    VERIFY_CERTIFICATE: (certificateId: string) => `/api/learning/certificates/verify/${certificateId}`,
    USER_CERTIFICATES: '/api/learning/certificates/user/all',
    COURSES: '/api/learning/courses',
    COURSE: (courseId: string) => `/api/learning/courses/${courseId}`,
    ENROLL: '/api/learning/enroll',
    COMPLETE_MODULE: '/api/learning/modules/complete',
    QUIZ: (quizId: string) => `/api/learning/quizzes/${quizId}`,
  },

  // Partnership endpoints
  PARTNERSHIPS: {
    INTEGRATIONS: '/api/partnerships/integrations',
    CONNECT: '/api/partnerships/integrations/connect',
    SYNC_MENU: (id: string) => `/api/partnerships/integrations/${id}/sync`,
    ANALYTICS: (restaurantId: string) => `/api/partnerships/integrations/restaurant/${restaurantId}/analytics`,
    GET_INTEGRATIONS: (restaurantId: string) => `/api/partnerships/integrations/restaurant/${restaurantId}`,
    DISCONNECT: (id: string) => `/api/partnerships/integrations/${id}/disconnect`,
    CERTIFICATIONS: '/api/partnerships/certifications',
    APPLY_CERTIFICATION: '/api/partnerships/certifications/apply',
    CURRENT_CERTIFICATION: '/api/partnerships/certifications/current',
    CERTIFICATION_PDF: (id: string) => `/api/partnerships/certifications/${id}/pdf`,
    VERIFY_CERTIFICATE: (certificateId: string) => `/api/partnerships/certifications/verify/${certificateId}`,
    RESTAURANTS: '/api/partnerships/restaurants',
    RESTAURANT: (id: string) => `/api/partnerships/restaurants/${id}`,
    RESTAURANT_MENU: (id: string) => `/api/partnerships/restaurants/${id}/menu`,
    APPLY: '/api/partnerships/apply',
    DELIVERY_PARTNERS: '/api/partnerships/delivery-partners',
    TRACK_DELIVERY: (orderId: string) => `/api/partnerships/delivery/${orderId}`,
  },

  // Campaign endpoints
  CAMPAIGNS: {
    LIST: '/api/campaigns',
    GET: (id: string) => `/api/campaigns/${id}`,
    CREATE: '/api/campaigns',
    UPDATE: (id: string) => `/api/campaigns/${id}`,
    DELETE: (id: string) => `/api/campaigns/${id}`,
    JOIN: (id: string) => `/api/campaigns/${id}/join`,
    LEAVE: (id: string) => `/api/campaigns/${id}/leave`,
    ANALYTICS: (id: string) => `/api/campaigns/${id}/analytics`,
  },

  // Institution endpoints (Admin)
  INSTITUTIONS: {
    LIST: '/api/institutions',
    GET: (id: string) => `/api/institutions/${id}`,
    CREATE: '/api/institutions',
    UPDATE: (id: string) => `/api/institutions/${id}`,
    DELETE: (id: string) => `/api/institutions/${id}`,
    VERIFY: (id: string) => `/api/institutions/${id}/verify`,
  },

  // Institutional tracking endpoints
  INSTITUTIONAL: {
    BULK_LOG: (institutionId: string) => `/api/institutional/${institutionId}/bulk-log`,
    COMPLIANCE: (institutionId: string) => `/api/institutional/${institutionId}/compliance`,
    COMPLIANCE_PDF: (institutionId: string) => `/api/institutional/${institutionId}/compliance/pdf`,
    DISTRICT_AGGREGATION: (district: string) => `/api/institutional/district/${district}`,
  },

  // Policy endpoints (Admin)
  POLICY: {
    GST_SIMULATION: '/api/policy/gst-simulation',
    NATIONAL_IMPACT: '/api/policy/national-impact',
    STATE_COMPARISON: '/api/policy/state-comparison',
    GENERATE_REPORT: '/api/policy/generate-report',
    REPORTS: '/api/policy/reports',
    COST_BENEFIT: '/api/policy/cost-benefit',
  },

  // Restaurant endpoints
  RESTAURANT: {
    MENU: (restaurantId: string) => `/api/restaurants/${restaurantId}/menu`,
    CREATE_DISH: (restaurantId: string) => `/api/restaurants/${restaurantId}/menu`,
    UPDATE_DISH: (restaurantId: string, dishId: string) => `/api/restaurants/${restaurantId}/menu/${dishId}`,
    DELETE_DISH: (restaurantId: string, dishId: string) => `/api/restaurants/${restaurantId}/menu/${dishId}`,
    STATS: (restaurantId: string) => `/api/restaurants/${restaurantId}/stats`,
    ORDERS: (restaurantId: string) => `/api/restaurants/${restaurantId}/orders/recent`,
  },

  // Admin endpoints
  ADMIN: {
    ACTIVITIES: '/api/admin/activities',
  },
} as const;
