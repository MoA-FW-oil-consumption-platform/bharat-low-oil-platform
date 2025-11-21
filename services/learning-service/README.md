# Learning Service - Bharat Low Oil Platform

E-learning modules, quizzes, and certification service for schools, communities, and institutional kitchens.

## Features

- 🎓 **Multilingual Learning Modules** (English, Hindi, Tamil, Bengali, Telugu)
- 📝 **Interactive Quizzes** with auto-grading
- 📜 **Government-issued Certificates** (PDF with GOI seal)
- 🏫 **Target Audiences**: Schools, Communities, Institutional Kitchens, MDM Schemes
- 📊 **Progress Tracking** with video watch time monitoring
- ✅ **Quiz Management** with attempt limits and passing scores
- 🔒 **JWT Authentication** for secure access

## Tech Stack

- **Framework**: Express + TypeScript
- **Database**: MongoDB
- **PDF Generation**: PDFKit
- **Video Hosting**: Cloudinary
- **Authentication**: JWT

## Setup

```bash
cd services/learning-service
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

## Port

**3007** - Learning Service

## API Endpoints

### Modules

- `GET /modules` - Get all modules (filters: targetAudience, difficulty, isPublished)
- `GET /modules/stats` - Get module statistics
- `GET /modules/:id` - Get module by ID
- `POST /modules` - Create module (admin only)
- `PUT /modules/:id` - Update module (admin only)
- `DELETE /modules/:id` - Delete module (admin only)

### Progress

- `POST /progress/:moduleId/start` - Start a module
- `PUT /progress/:moduleId` - Update progress (lessons, video time)
- `POST /progress/:moduleId/quiz` - Submit quiz answers
- `GET /progress` - Get user's progress (all modules)
- `GET /progress/stats` - Get progress statistics

### Certificates

- `POST /certificates/:moduleId/generate` - Generate PDF certificate
- `GET /certificates/:moduleId` - Get certificate details
- `GET /certificates/verify/:certificateId` - Verify certificate (public)
- `GET /certificates/user/all` - Get all user certificates

## Usage Examples

### Create Module (Admin)

```bash
curl -X POST http://localhost:3007/modules \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Healthy Cooking Basics",
    "titleHindi": "स्वस्थ खाना पकाने की मूल बातें",
    "description": "Learn the fundamentals of low-oil cooking",
    "content": "Module content here...",
    "targetAudience": "school",
    "duration": 30,
    "difficulty": "beginner",
    "learningObjectives": ["Understand ICMR guidelines", "Learn oil-free cooking methods"],
    "topics": ["nutrition", "cooking-methods", "health"],
    "isPublished": true
  }'
```

### Start Module

```bash
curl -X POST http://localhost:3007/progress/MODULE_ID/start \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Submit Quiz

```bash
curl -X POST http://localhost:3007/progress/MODULE_ID/quiz \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "answers": [
      {"questionIndex": 0, "selectedOption": 2},
      {"questionIndex": 1, "selectedOption": 1}
    ]
  }'
```

### Generate Certificate

```bash
curl -X POST http://localhost:3007/certificates/MODULE_ID/generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  --output certificate.pdf
```

## Module Structure

```typescript
{
  title: "Module Title",
  titleHindi: "हिंदी शीर्षक",
  titleTamil: "தமிழ் தலைப்பு",
  titleBengali: "বাংলা শিরোনাম",
  titleTelugu: "తెలుగు శీర్షిక",
  description: "Module description",
  content: "Full module content (Markdown supported)",
  videoUrl: "https://cloudinary.com/video.mp4",
  targetAudience: "school" | "community" | "institutional" | "mdm" | "general",
  duration: 30, // minutes
  difficulty: "beginner" | "intermediate" | "advanced",
  learningObjectives: ["Objective 1", "Objective 2"],
  topics: ["nutrition", "health"],
  isPublished: true
}
```

## Quiz Schema

```typescript
{
  moduleId: "MODULE_ID",
  questions: [
    {
      question: "What is the ICMR recommended oil limit?",
      options: ["500ml", "1000ml", "1500ml", "2000ml"],
      correctAnswer: 1, // index of correct option
      explanation: "ICMR recommends 1000ml per person per month",
      points: 10
    }
  ],
  passingScore: 70, // percentage
  maxAttempts: 3
}
```

## Certificate Features

- Government of India official header
- Module title and completion date
- User score (percentage)
- Unique certificate ID
- Verification URL
- Digital signatures (Secretary & Program Director)
- Watermark with verification link

## Target Audiences

- **school**: Primary/secondary school students
- **community**: General public, community health programs
- **institutional**: Canteen managers, hospital dietary staff
- **mdm**: Mid-Day Meal scheme coordinators
- **general**: All users

## Environment Variables

```env
PORT=3007
MONGODB_URI=mongodb://localhost:27017/bharat-low-oil-learning
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Integration with API Gateway

Add to API Gateway routes:

```typescript
app.use('/api/learning', createProxyMiddleware({
  target: 'http://localhost:3007',
  changeOrigin: true,
  pathRewrite: { '^/api/learning': '' }
}));
```

## License

Part of Bharat Low Oil Platform - Government of India Initiative
