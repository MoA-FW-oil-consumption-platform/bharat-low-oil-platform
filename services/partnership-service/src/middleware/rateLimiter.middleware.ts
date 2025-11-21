import rateLimit from 'express-rate-limit';

// Default rate limit for external partner APIs
export const partnerRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  message: {
    error: 'Too many requests from this API key, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use API key or partner ID for rate limiting
    const apiKey = req.headers['x-api-key'] as string;
    const partner = (req as any).partner;
    return apiKey || partner?.partnerId || req.ip;
  }
});

// Stricter rate limit for authentication endpoint
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 auth attempts per 15 minutes
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});
