# Admin Dashboard - Bharat Low Oil Platform

Government administrative portal for monitoring and managing the national oil consumption reduction initiative.

## Features

### 1. **National Dashboard**
- Real-time statistics (users, active today, avg reduction, certifications)
- Consumption trends chart (actual vs target)
- National heatmap with state-wise breakdown
- Top states by consumption (horizontal bar chart)
- Recent activities feed

### 2. **User Management**
- User listing with pagination and search
- Filters: region, date range, consumption status
- User statistics overview
- Individual user consumption history
- Export user data (CSV/Excel)

### 3. **Restaurant Certifications**
- Certification request review queue
- Approve/reject workflow
- Certificate generation with QR codes
- Blockchain verification integration
- Statistics: pending, approved, rejected, expired

### 4. **Campaign Management**
- Create national/regional awareness campaigns
- Campaign performance metrics
- Target audience selection
- Push notification scheduling
- Campaign effectiveness analysis

### 5. **Analytics**
- Advanced time-series analysis
- Regional consumption breakdowns
- Demographic analysis (age, gender, family size)
- Trend forecasting
- Custom date range reports

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Maps**: Leaflet + React-Leaflet
- **State Management**: Zustand
- **API Calls**: React Query + Axios
- **Icons**: Lucide React

## Setup

```bash
# Navigate to admin dashboard
cd apps/admin-dashboard

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Access at: http://localhost:3100

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Routes

- `/dashboard` - Main dashboard with national stats
- `/dashboard/users` - User management
- `/dashboard/restaurants` - Restaurant certifications
- `/dashboard/campaigns` - Campaign management
- `/dashboard/analytics` - Advanced analytics
- `/dashboard/settings` - System settings

## Authentication

- Admin login via Supabase Auth
- Role-based access control (RBAC)
- JWT token validation
- Session management

## Deployment

### Vercel (Recommended)

```bash
npm run build
vercel --prod
```

### Docker

```bash
docker build -t admin-dashboard .
docker run -p 3100:3100 admin-dashboard
```

## Development Guidelines

- Components are in `/src/components` organized by feature
- Pages use Next.js App Router in `/src/app`
- API calls should use React Query for caching
- All charts should be responsive (use ResponsiveContainer)
- Follow accessibility guidelines (WCAG 2.1 AA)

## License

Part of Bharat Low Oil Platform - Government of India Initiative
