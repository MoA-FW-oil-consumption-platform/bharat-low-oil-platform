import rateLimit from 'express-rate-limit';
import Redis from 'ioredis';

const redis = process.env.UPSTASH_REDIS_URL 
  ? new Redis(process.env.UPSTASH_REDIS_URL)
  : null;

export const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  // Use Redis if available, otherwise in-memory
  ...(redis && {
    store: {
      increment: async (key: string) => {
        const current = await redis.incr(key);
        if (current === 1) {
          await redis.expire(key, 900); // 15 minutes
        }
        return { totalHits: current, resetTime: new Date(Date.now() + 900000) };
      },
      decrement: async (key: string) => {
        await redis.decr(key);
      },
      resetKey: async (key: string) => {
        await redis.del(key);
      }
    }
  })
});
