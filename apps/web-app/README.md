# Bharat Low Oil Platform - User Web App

Public-facing web application for citizens to track oil consumption, get AI recommendations, and participate in campaigns.

## Features

- 🏠 **Dashboard**: Personal consumption stats, trends, health insights
- 📊 **Tracking**: Log oil consumption, view history, analytics
- 🍳 **Recipes**: Browse low-oil recipes with filters
- 🏆 **Rewards**: Points, badges, achievements, leaderboard
- 📍 **Restaurants**: Find certified low-oil restaurants nearby
- 🎯 **Campaigns**: Join government initiatives, track progress
- 🤖 **AI Insights**: Personalized predictions and recommendations

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **React**: 19.0.0
- **Styling**: Tailwind CSS 3.4
- **Charts**: Recharts 2.13
- **Icons**: Lucide React 0.454
- **TypeScript**: 5.7
- **Backend**: API Gateway (http://localhost:3000)

## Getting Started

```bash
cd apps/web-app
npm install
npm run dev
```

Visit: http://localhost:3300

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Port

**3300** - User Web App (to avoid conflicts with admin dashboard on 3100)

## Routes

- `/` - Home & Landing
- `/dashboard` - User Dashboard
- `/dashboard/tracking` - Oil Consumption Tracking
- `/dashboard/recipes` - Recipe Browser
- `/dashboard/restaurants` - Restaurant Directory
- `/dashboard/rewards` - Gamification & Achievements
- `/dashboard/campaigns` - Active Campaigns
- `/profile` - User Profile & Settings

## API Integration

All API calls go through API Gateway:

```typescript
import { apiClient } from '@/lib/api-client';

// Example: Get user profile
const profile = await apiClient.get('/api/user/profile', { 
  token: accessToken 
});
```

## Deployment

- **Vercel**: Free tier (recommended)
- **Railway**: $5 credit
- **Azure App Service**: Student credits

```bash
npm run build
npm start
```

## License

Part of Bharat Low Oil Platform - Government of India Initiative
