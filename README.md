# 🇮🇳 Bharat Low Oil Consumption Platform

A comprehensive digital platform to reduce edible oil consumption in India by 10%, as announced by Hon'ble Prime Minister in Mann Ki Baat (Feb 2025).

## 🎯 Mission

Reduce India's edible oil consumption from 19.3 kg to 12 kg per capita annually through behavioral nudges, AI-powered recommendations, and policy interventions.

## 📱 Platform Components

### User-Facing Apps
- **Mobile App** (React Native + Expo) - Oil tracking, AI recommendations, gamification
- **Admin Dashboard** (Next.js) - National/state consumption analytics
- **Restaurant Portal** (Next.js) - Certification and low-oil menu management

### Backend Services
- **API Gateway** - Central entry point with rate limiting
- **Auth Service** - Supabase-powered authentication
- **User Service** - Profile and preference management
- **Tracking Service** - Oil consumption logging and analytics
- **AI Service** (Python) - Consumption prediction and recipe recommendations
- **Reward Service** - Gamification and point system
- **Partnership Service** - Restaurant partnerships and certifications

### Innovation Layer
- **Blockchain** - Certificate verification on Polygon Amoy testnet
- **IoT Simulator** - Smart oil bottle weight tracking (MQTT)

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Python 3.11+ (for AI service)
- Docker & Docker Compose (optional)
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/MoA-FW-oil-consumption-platform/bharat-low-oil-platform.git
cd bharat-low-oil-platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Start all services with Docker
npm run docker:up

# OR run individually
npm run dev          # All services
npm run mobile       # Mobile app
npm run admin        # Admin dashboard
npm run restaurant   # Restaurant portal
```

### Development Setup (Without Docker)

```bash
# Install dependencies for all workspaces
npm install

# Set up databases
# 1. Create MongoDB Atlas account (free tier)
# 2. Create Supabase project (free tier)
# 3. Update .env with credentials

# Start services individually
cd services/api-gateway && npm run dev
cd services/auth-service && npm run dev
cd services/user-service && npm run dev
# ... repeat for other services

# Start mobile app
cd apps/mobile-app && npm start

# Start web portals
cd apps/admin-dashboard && npm run dev
cd apps/restaurant-portal && npm run dev
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Mobile App (Expo)                        │
│              Admin Dashboard & Restaurant Portal             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway (3000)                       │
│            Rate Limiting | Authentication | Routing          │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┬─────────────┐
         ▼               ▼               ▼             ▼
    ┌────────┐    ┌──────────┐    ┌─────────┐   ┌──────────┐
    │  Auth  │    │   User   │    │Tracking │   │    AI    │
    │ (3001) │    │  (3002)  │    │ (3003)  │   │  (3004)  │
    └────────┘    └──────────┘    └─────────┘   └──────────┘
         │               │               │             │
         └───────────────┴───────────────┴─────────────┘
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
        ┌──────────┐          ┌──────────┐
        │ MongoDB  │          │Supabase  │
        │  Atlas   │          │PostgreSQL│
        └──────────┘          └──────────┘
```

## 📁 Project Structure

```
bharat-low-oil-platform/
├── apps/
│   ├── mobile-app/              # React Native + Expo
│   ├── admin-dashboard/         # Next.js admin panel
│   └── restaurant-portal/       # Next.js restaurant interface
├── services/
│   ├── api-gateway/             # Express gateway
│   ├── auth-service/            # Supabase auth wrapper
│   ├── user-service/            # User profiles
│   ├── tracking-service/        # Oil consumption tracking
│   ├── ai-service/              # Python FastAPI ML service
│   ├── reward-service/          # Gamification
│   └── partnership-service/     # Restaurant partnerships
├── packages/
│   ├── shared-types/            # TypeScript types
│   ├── ui-components/           # Shared React components
│   └── utils/                   # Common utilities
├── blockchain/
│   ├── contracts/               # Solidity smart contracts
│   ├── scripts/                 # Deployment scripts
│   └── test/                    # Contract tests
├── iot/
│   ├── simulator/               # MQTT device simulator
│   └── esp32-firmware/          # Arduino firmware (future)
├── infra/
│   ├── docker/                  # Dockerfiles
│   └── scripts/                 # Setup automation
└── docs/                        # Documentation
```

## 🛠️ Tech Stack

### Frontend
- **Mobile**: React Native, Expo SDK 50, TypeScript
- **Web**: Next.js 14, TailwindCSS, Shadcn/ui
- **State**: Zustand, React Query
- **i18n**: react-i18next (Hindi, Tamil, Telugu, Bengali)

### Backend
- **Runtime**: Node.js 20, Express, TypeScript
- **AI/ML**: Python 3.11, FastAPI, scikit-learn
- **Databases**: MongoDB Atlas, Supabase PostgreSQL
- **Auth**: Supabase Auth, JWT
- **Caching**: Upstash Redis
- **Storage**: Cloudinary

### Infrastructure
- **Hosting**: Vercel, Render, Railway, Azure
- **Blockchain**: Polygon Amoy Testnet, Hardhat, Ethers.js
- **IoT**: MQTT (HiveMQ), WebSockets
- **Monitoring**: Sentry, Vercel Analytics

## 🎮 Key Features

### Mobile App
- ✅ Multilingual onboarding (English, Hindi, Tamil)
- ✅ Oil consumption tracking (manual & IoT)
- ✅ AI-powered health risk assessment
- ✅ Personalized low-oil recipe recommendations
- ✅ Gamification (points, badges, streaks)
- ✅ Barcode scanner for oil products
- ✅ Learning modules and quizzes
- ✅ Push notifications and daily nudges

### Admin Dashboard
- ✅ National heatmap (state/district drill-down)
- ✅ Consumption trend analytics
- ✅ Campaign impact tracking
- ✅ Restaurant certification management
- ✅ Policy metrics (import reduction, health savings)

### Restaurant Portal
- ✅ Dish management with oil estimation
- ✅ Certification workflow
- ✅ QR code generation
- ✅ Blockchain-verified certificates
- ✅ Menu nutritional analysis

### AI/ML Features
- ✅ Rule-based consumption risk calculator
- ✅ Usage prediction model (regression)
- ✅ Recipe recommendation engine
- ✅ Regional cuisine adaptation

### Blockchain
- ✅ Restaurant certification on Polygon testnet
- ✅ Immutable audit trails
- ✅ QR code verification

### IoT Integration
- ✅ MQTT-based smart oil bottle simulator
- ✅ Real-time weight tracking
- ✅ Automatic consumption calculation

## 📊 Development Timeline (30 Days)

### Week 1: Foundation
- [x] Project structure and monorepo setup
- [ ] Database schemas (Prisma + Mongoose)
- [ ] Authentication setup (Supabase)
- [ ] API Gateway with rate limiting
- [ ] Mobile app scaffold

### Week 2: Core Features
- [ ] User registration and profiles
- [ ] Oil consumption tracking (manual)
- [ ] Basic AI risk calculation
- [ ] Mobile-backend integration
- [ ] Reward system

### Week 3: Advanced Features
- [ ] Admin dashboard with analytics
- [ ] Restaurant portal
- [ ] Recipe recommendation API
- [ ] IoT simulator integration
- [ ] Push notifications

### Week 4: Innovation & Polish
- [ ] Blockchain certificate system
- [ ] ML model training
- [ ] Barcode scanner
- [ ] Learning modules
- [ ] E2E testing and deployment

## 🔐 Security

- JWT-based authentication
- Rate limiting (100 req/15min)
- CORS configuration
- Environment variable encryption
- SQL injection prevention (Prisma ORM)
- XSS protection (Helmet.js)

## 🌍 Deployment

### Free Tier Services
- **Vercel**: Web portals (unlimited projects)
- **Render**: 3 backend services (750 hrs/month)
- **Railway**: 2 backend services ($5 credit/month)
- **MongoDB Atlas**: 512MB free tier
- **Supabase**: 500MB PostgreSQL + Auth
- **Cloudinary**: 25GB storage/bandwidth
- **HiveMQ Cloud**: 100 MQTT connections

### Azure (Student Credits)
- API Gateway only (~$20/month)

## 🤝 Contributing

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git commit -m "feat: add your feature"

# Push and create PR
git push origin feature/your-feature
```

## 📝 License

MIT License - Ministry of Agriculture & Farmers Welfare

## 📧 Contact

- **Project Lead**: Pritto Ruban 
- **Repository**: https://github.com/MoA-FW-oil-consumption-platform/bharat-low-oil-platform
- **Issues**: https://github.com/MoA-FW-oil-consumption-platform/bharat-low-oil-platform/issues

---

**Built for Smart India Hackathon 2025** 🇮🇳
