# AI Service - Bharat Low Oil Platform

Machine Learning service providing intelligent predictions and personalized recommendations for oil consumption.

## Features

### 1. Consumption Prediction
- **Time-series forecasting** of oil consumption (1-90 days ahead)
- Uses **Ridge Regression** with feature engineering
- Features: day patterns, family size, historical averages, streaks
- Confidence scoring based on data availability

### 2. Recipe Recommendations
- **Content-based filtering** for personalized recipe suggestions
- Factors: dietary habits, health conditions, cuisine preferences, oil amount
- Weighted scoring algorithm (0-100 score)
- Multi-language support (English, Hindi, Tamil)

### 3. Insights & Analytics
- Consumption trend analysis (increasing/decreasing/stable)
- Health risk assessment (healthy/moderate/high_risk)
- ICMR guideline comparisons (1000ml/person/month)
- Peak consumption day identification
- Achievement tracking

## Tech Stack

- **Framework**: FastAPI 0.104
- **ML Libraries**: scikit-learn, pandas, numpy
- **Database**: MongoDB (via motor async driver)
- **Models**: Ridge Regression (consumption), Content-based filtering (recipes)
- **Serialization**: joblib (model persistence)

## API Endpoints

### Predictions
- `POST /predictions/consumption` - Predict future oil consumption
- `POST /predictions/train` - Train the prediction model (admin)

### Recommendations
- `POST /recommendations/recipes` - Get personalized recipe recommendations
- `GET /recommendations/popular` - Get popular low-oil recipes

### Insights
- `POST /insights/user` - Get user consumption insights
- `GET /insights/national` - Get national-level statistics (admin)

### Health
- `GET /health` - Service health check

## Setup

### Prerequisites
- Python 3.11+
- MongoDB running on localhost:27017 (or set MONGODB_URI)

### Installation

```bash
# Navigate to service directory
cd services/ai-service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env
# Edit .env with your configuration

# Run the service
python main.py
```

### Docker

```bash
# Build image
docker build -t bharat-ai-service .

# Run container
docker run -p 3004:3004 --env-file .env bharat-ai-service
```

## Environment Variables

```env
PORT=3004                                      # Service port
MONGODB_URI=mongodb://localhost:27017/bharat-low-oil
JWT_SECRET=your-jwt-secret
MODEL_PATH=./models                            # Model storage path
RETRAIN_INTERVAL_DAYS=7                        # Auto-retrain frequency
```

## ML Model Details

### Consumption Prediction Model

**Algorithm**: Ridge Regression (L2 regularization)

**Features**:
- `day_of_week` (0-6): Day pattern detection
- `day_of_month` (1-31): Monthly cycle patterns
- `month` (1-12): Seasonal variations
- `family_size`: Scaling factor
- `age`: User demographic
- `is_weekend` (0/1): Weekend vs weekday patterns
- `prev_day_consumption`: Temporal dependency
- `7_day_avg`: Short-term trend
- `30_day_avg`: Long-term trend

**Training**:
- Requires minimum 10 users with 7+ days of data
- StandardScaler for feature normalization
- Metrics: MAE, RMSE, R²
- Models saved to `./models/` directory

**Prediction**:
- Minimum 7 days of history required
- Confidence increases with data quantity (0.5 + logs/100, max 0.9)
- Non-negative output constraint

### Recipe Recommendation Model

**Algorithm**: Content-based filtering with weighted scoring

**Scoring Factors** (0-100):
- **Oil amount** (30 pts max): <20ml=30, <40ml=20, <60ml=10
- **Dietary match** (25-30 pts): Vegetarian/vegan alignment
- **Cuisine preference** (20 pts): User's preferred cuisines
- **Health optimization** (15 pts each): Diabetes-friendly, heart-healthy
- **Low-calorie bonus** (10 pts): Calorie-conscious recipes
- **Difficulty** (5 pts): Easy recipes get slight boost

**Ranking**: Descending by total score, return top N

## Model Training

The consumption model can be trained via API:

```bash
# Train with all available data
curl -X POST http://localhost:3004/predictions/train

# Response includes metrics
{
  "status": "success",
  "metrics": {
    "mae": 12.5,
    "rmse": 18.3,
    "r2": 0.75
  },
  "training_samples": 1250,
  "users_count": 42
}
```

**Recommendation**: Retrain weekly or when significant new data available

## Usage Examples

### Predict Consumption

```bash
curl -X POST http://localhost:3004/predictions/consumption \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "days_ahead": 30
  }'
```

Response:
```json
{
  "userId": "user123",
  "predictions": [
    {"date": "2025-11-22T00:00:00", "predicted_amount": 45.2},
    {"date": "2025-11-23T00:00:00", "predicted_amount": 38.7}
  ],
  "confidence": 0.82,
  "recommendations": [
    "✅ Great! Your predicted consumption is within healthy limits"
  ],
  "generated_at": "2025-11-21T12:00:00"
}
```

### Get Recipe Recommendations

```bash
curl -X POST http://localhost:3004/recommendations/recipes \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "limit": 10,
    "filters": {
      "maxOilAmount": "40",
      "cuisine": "Indian",
      "difficulty": "easy"
    }
  }'
```

### Get User Insights

```bash
curl -X POST http://localhost:3004/insights/user \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "period": "month"
  }'
```

Response:
```json
{
  "userId": "user123",
  "period": "month",
  "total_consumption": 1350.5,
  "average_daily": 45.0,
  "trend": "decreasing",
  "health_status": "healthy",
  "comparison_to_average": -10.5,
  "peak_consumption_days": [
    "2025-11-15 (120ml)",
    "2025-11-10 (95ml)"
  ],
  "recommendations": [
    "✅ Excellent! You're maintaining healthy oil consumption"
  ],
  "achievements": [
    "🏆 Weekly Warrior: Logged 7 consecutive days",
    "🔥 14-day logging streak!"
  ]
}
```

## Performance Optimization

### For Production:
1. **Use pre-trained models**: Train offline, load on startup
2. **Caching**: Cache predictions for 24 hours
3. **Batch processing**: Process multiple users concurrently
4. **Database indexing**: Ensure indexes on userId + date fields
5. **Model updates**: Schedule retraining during low-traffic hours

### Scaling:
- Horizontal scaling supported (stateless design)
- Use load balancer for multiple instances
- Consider Redis for prediction caching
- Separate read/write MongoDB replicas

## Future Enhancements

- [ ] Deep learning (LSTM) for time-series prediction
- [ ] Collaborative filtering for recipe recommendations
- [ ] Real-time model updates (online learning)
- [ ] A/B testing framework for model variants
- [ ] Explainable AI (SHAP values) for predictions
- [ ] Image-based food recognition (oil estimation)
- [ ] Multi-model ensemble for higher accuracy

## License

Part of the Bharat Low Oil Platform - Government of India Initiative
