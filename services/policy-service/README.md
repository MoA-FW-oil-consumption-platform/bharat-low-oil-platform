# Policy Service

GST policy dashboard and national impact analysis for the Bharat Low-Oil Campaign platform.

## Features

### 1. GST Revenue Simulation
- Simulate impact of oil consumption shifts on GST revenue
- Configurable oil type distributions (healthy/regular/unhealthy)
- Multi-scenario analysis with current vs projected comparisons

### 2. National Impact Metrics
- Total oil reduction calculations (in tonnes)
- Import savings estimation (70% import dependency)
- Healthcare cost averted from lifestyle disease reduction
- Carbon emission reduction tracking
- GST revenue impact analysis

### 3. State-wise Comparison
- Rank states by oil reduction performance
- Efficiency scoring (reduction % normalized by user base)
- Top 5 and bottom 5 performer identification
- District-level drill-down support

### 4. Ministerial Reports
- Auto-generated PDF reports with Government of India branding
- Executive summaries for policy makers
- 5-year projections
- Policy recommendations based on data
- Multiple report types: GST simulation, National impact, State comparison, Ministerial summary

### 5. Cost-Benefit Analysis
- ROI calculation for program investment
- Break-even year estimation
- Net benefit computation (import savings + healthcare - GST loss - program cost)

## Installation

```bash
npm install
```

## Configuration

Create `.env` file:

```env
PORT=3008
MONGODB_URI=mongodb://localhost:27017/bloc-policy
TRACKING_SERVICE_URL=http://localhost:3003
USER_SERVICE_URL=http://localhost:3002
AI_SERVICE_URL=http://localhost:8000
JWT_SECRET=your-secret-key-here
```

## Running

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## API Documentation

### 1. GST Revenue Simulation

```bash
POST /api/policy/gst-simulation
Content-Type: application/json

{
  "userCount": 250000,
  "currentDistribution": {
    "healthy": 0.15,
    "regular": 0.55,
    "unhealthy": 0.30
  },
  "projectedDistribution": {
    "healthy": 0.35,
    "regular": 0.45,
    "unhealthy": 0.20
  },
  "avgConsumptionPerUser": 1.5
}
```

**Response:**
```json
{
  "message": "GST simulation completed",
  "simulation": {
    "scenario": "Oil consumption shift to healthier alternatives",
    "currentRevenue": 18750000,
    "projectedRevenue": 15937500,
    "revenueDifference": -2812500,
    "percentageChange": -15,
    "affectedUsers": 250000,
    "details": {
      "healthyOilConsumption": 131250,
      "regularOilConsumption": 168750,
      "unhealthyOilConsumption": 75000
    }
  },
  "gstRates": {
    "healthyOils": { "olive": 5, "mustard": 5, "groundnut": 5 },
    "regularOils": { "sunflower": 12, "soybean": 12 },
    "unhealthyOils": { "palm": 18, "vanaspati": 18 }
  }
}
```

### 2. National Impact Metrics

```bash
GET /api/policy/national-impact?startDate=2025-01-01&endDate=2025-11-21
```

**Response:**
```json
{
  "period": {
    "startDate": "2025-01-01",
    "endDate": "2025-11-21"
  },
  "nationalImpact": {
    "totalUsers": 250000,
    "avgReductionPercentage": 18.5,
    "totalOilReduction": 832.5,
    "estimatedImportSavings": 8.74,
    "healthcareCostAverted": 37.5,
    "carbonEmissionReduced": 2081.25,
    "gstRevenueImpact": -45
  },
  "projections": {
    "next5Years": {
      "oilReduction": 4162.5,
      "importSavings": 43.7,
      "carbonReduction": 10406.25
    }
  }
}
```

### 3. State-wise Comparison

```bash
GET /api/policy/state-comparison?startDate=2025-01-01&endDate=2025-11-21&limit=15
```

**Response:**
```json
{
  "period": {
    "startDate": "2025-01-01",
    "endDate": "2025-11-21"
  },
  "totalStates": 15,
  "rankings": [
    {
      "rank": 1,
      "state": "Kerala",
      "users": 35000,
      "avgReduction": 25.8,
      "efficiency": 117.42
    },
    {
      "rank": 2,
      "state": "Tamil Nadu",
      "users": 45000,
      "avgReduction": 22.5,
      "efficiency": 105.12
    }
  ],
  "topPerformers": [...],
  "bottomPerformers": [...],
  "insights": {
    "bestState": { "rank": 1, "state": "Kerala", "avgReduction": 25.8 },
    "avgReduction": "18.45",
    "totalUsers": 385000
  }
}
```

### 4. Generate Ministerial Report (PDF)

```bash
POST /api/policy/generate-report
Content-Type: application/json

{
  "reportType": "ministerial_summary",
  "startDate": "2025-01-01",
  "endDate": "2025-11-21",
  "includeProjections": true,
  "includeStateRankings": true
}
```

Returns PDF file with:
- Executive summary
- GST revenue impact
- State rankings (top 10)
- Policy recommendations
- 5-year projections
- Government of India branding

### 5. Get All Reports

```bash
GET /api/policy/reports?reportType=ministerial_summary&status=published&limit=20
```

### 6. Cost-Benefit Analysis

```bash
POST /api/policy/cost-benefit
Content-Type: application/json

{
  "programCost": 150,
  "totalUsers": 250000,
  "avgReduction": 18.5,
  "avgConsumption": 1.5
}
```

**Response:**
```json
{
  "programCost": "₹150 Crores",
  "nationalImpact": {
    "totalOilReduction": 832.5,
    "estimatedImportSavings": 8.74,
    "healthcareCostAverted": 37.5,
    "gstRevenueImpact": -45
  },
  "costBenefit": {
    "totalBenefits": 1.24,
    "netBenefit": -148.76,
    "roi": -99.17,
    "breakEvenYears": 120.97
  },
  "verdict": "Program needs optimization"
}
```

## GST Rates (Simulated)

Pending Finance Ministry integration:

| Oil Category | Oil Type | GST Rate |
|-------------|----------|----------|
| Healthy | Olive, Mustard, Groundnut, Sesame | 5% |
| Regular | Sunflower, Soybean, Safflower | 12% |
| Unhealthy | Palm, Vanaspati, Coconut | 18% |

## Calculation Methodology

### Import Savings
- India imports 70% of edible oil
- Formula: `Oil Reduction (tonnes) × 70% × ₹150/kg`

### Healthcare Cost Averted
- 30% of users benefit from health improvements
- Formula: `Total Users × 30% × ₹5000/year`

### Carbon Emission Reduction
- 2.5 kg CO₂ per kg oil produced/transported
- Formula: `Oil Reduction (kg) × 2.5`

### State Efficiency Score
- Logarithmic scale for fairness across population sizes
- Formula: `Avg Reduction % × log₁₀(Users + 1)`

## Integration with Other Services

- **Tracking Service**: Aggregate oil consumption data
- **User Service**: Total user count
- **AI Service**: Predictive insights (optional)

## Testing

```bash
npm test
```

## License

Government of India - Smart India Hackathon 2025
