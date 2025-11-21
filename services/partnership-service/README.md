# Partnership Service

Food delivery integration and external restaurant partner API for the Bharat Low-Oil Campaign platform.

## Features

### 1. Food Delivery Integrations
- Mock adapter for Swiggy, Zomato, Uber Eats
- Menu sync with automatic low-oil badge assignment (< 15ml per serving)
- Order analytics and tracking
- Webhook simulation for testing

### 2. External Partner APIs
- Self-service restaurant integration
- API key authentication with JWT
- Rate limiting (100 requests per 15 minutes)
- Blockchain certification verification
- Webhook subscriptions

## Installation

```bash
npm install
```

## Configuration

Create `.env` file:

```env
PORT=3006
MONGODB_URI=mongodb://localhost:27017/bloc-partnerships
JWT_SECRET=your-secret-key-here
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BLOCKCHAIN_CONTRACT_ADDRESS=0x...
BLOCKCHAIN_EXPLORER_URL=https://etherscan.io
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

### Food Delivery Integration APIs (Internal)

#### 1. Connect to Platform
```bash
POST /api/integrations/connect
Content-Type: application/json

{
  "restaurantId": "rest_123",
  "restaurantName": "Green Kitchen",
  "platform": "swiggy",
  "webhookUrl": "https://example.com/webhook"
}
```

#### 2. Sync Menu
```bash
POST /api/integrations/:id/sync
Content-Type: application/json

{
  "menuItems": [
    {
      "name": "Grilled Chicken Salad",
      "oilAmount": 10,
      "category": "Salads",
      "price": 250
    },
    {
      "name": "Paneer Butter Masala",
      "oilAmount": 25,
      "category": "Main Course",
      "price": 350
    }
  ]
}
```

**Response:**
```json
{
  "message": "Menu synced successfully",
  "result": {
    "platformMenuId": "menu_swiggy_rest_123_1234567890",
    "totalItems": 2,
    "lowOilItems": 1,
    "lowOilPercentage": 50,
    "lastSyncAt": "2025-01-15T10:30:00.000Z"
  }
}
```

#### 3. Get Analytics
```bash
GET /api/integrations/restaurant/:restaurantId/analytics?days=30
```

**Response:**
```json
{
  "restaurantId": "rest_123",
  "period": "Last 30 days",
  "platforms": [
    {
      "platform": "swiggy",
      "status": "connected",
      "totalOrders": 150,
      "lowOilOrders": 75,
      "lowOilPercentage": 50,
      "menuItems": {
        "total": 25,
        "lowOil": 12
      }
    }
  ],
  "summary": {
    "totalOrders": 150,
    "lowOilOrders": 75,
    "overallLowOilPercentage": 50,
    "platformCount": 1
  }
}
```

#### 4. Simulate Webhook
```bash
POST /api/integrations/:id/webhook/simulate
```

### External Partner APIs (Public)

#### 1. Register Partner
```bash
POST /api/partner/register
Content-Type: application/json

{
  "restaurantId": "ext_rest_456",
  "restaurantName": "Healthy Bites",
  "email": "owner@healthybites.com",
  "phone": "+91-9876543210",
  "permissions": ["menu:read", "menu:write", "cert:read"]
}
```

**Response:**
```json
{
  "message": "Partner registered successfully",
  "partner": {
    "partnerId": "partner_a1b2c3d4e5f6g7h8",
    "restaurantId": "ext_rest_456",
    "restaurantName": "Healthy Bites",
    "apiKey": "bloc_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
    "permissions": ["menu:read", "menu:write", "cert:read"],
    "rateLimit": 100
  },
  "warning": "Store this API key securely. It will not be shown again."
}
```

#### 2. Get JWT Token
```bash
POST /api/partner/auth/token
X-API-Key: bloc_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h",
  "partner": {
    "partnerId": "partner_a1b2c3d4e5f6g7h8",
    "restaurantId": "ext_rest_456",
    "permissions": ["menu:read", "menu:write", "cert:read"]
  }
}
```

#### 3. Upload Menu
```bash
POST /api/partner/menu/upload
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "items": [
    {
      "name": "Steamed Momos",
      "oilAmount": 8,
      "category": "Appetizers",
      "price": 120
    },
    {
      "name": "Grilled Paneer",
      "oilAmount": 12,
      "category": "Main Course",
      "price": 280
    }
  ]
}
```

**Response:**
```json
{
  "message": "Menu uploaded successfully",
  "restaurantId": "ext_rest_456",
  "summary": {
    "totalItems": 2,
    "lowOilCertified": 2,
    "certificationRate": 100,
    "uploadedAt": "2025-01-15T11:00:00.000Z"
  },
  "items": [
    {
      "name": "Steamed Momos",
      "oilAmount": 8,
      "lowOilCertified": true,
      "certificationBadge": "🟢 BLOC Low-Oil Certified"
    },
    {
      "name": "Grilled Paneer",
      "oilAmount": 12,
      "lowOilCertified": true,
      "certificationBadge": "🟢 BLOC Low-Oil Certified"
    }
  ]
}
```

#### 4. Check Certification
```bash
POST /api/partner/certification/check
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "restaurantId": "ext_rest_456"
}
```

**Response:**
```json
{
  "message": "Certification retrieved successfully",
  "certification": {
    "restaurantId": "ext_rest_456",
    "certificateId": "CERT_ext_rest_456_1234567890",
    "level": "Gold",
    "score": 85,
    "issueDate": "2025-01-15T00:00:00.000Z",
    "expiryDate": "2026-01-15T00:00:00.000Z",
    "verificationUrl": "https://etherscan.io/tx/0x...",
    "status": "active",
    "criteria": {
      "lowOilMenuPercentage": 65,
      "customerSatisfaction": 4.5,
      "complianceScore": 90
    }
  }
}
```

#### 5. Subscribe to Webhooks
```bash
POST /api/partner/webhook/subscribe
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "webhookUrl": "https://restaurant.com/bloc-webhook",
  "events": ["certification_updated", "compliance_alert"]
}
```

#### 6. Get Usage Stats
```bash
GET /api/partner/stats
Authorization: Bearer <JWT_TOKEN>
```

## Mock Delivery Adapter

The service includes a mock adapter simulating real delivery platform behavior:

- **Realistic delays**: 2-5 seconds for menu sync
- **Error simulation**: 5% chance of API errors
- **Order generation**: Random orders with oil consumption data
- **Analytics**: Platform-specific metrics

## Rate Limiting

- **Partner APIs**: 100 requests per 15 minutes per API key
- **Authentication**: 10 attempts per 15 minutes
- **Custom limits**: Can be configured per partner

## Security

- API keys hashed with bcrypt
- JWT tokens expire in 24 hours
- Permission-based access control
- Rate limiting on all endpoints
- CORS and Helmet for HTTP security

## Low-Oil Certification Criteria

Menu items are automatically certified as "low-oil" if:
- Oil amount < 15ml per serving
- Badge: 🟢 BLOC Low-Oil Certified

## Integration Examples

See `/docs/partner-integration-guide.md` for detailed integration examples in:
- Node.js
- Python
- cURL

## Testing

```bash
npm test
```

## License

Government of India - Smart India Hackathon 2025
