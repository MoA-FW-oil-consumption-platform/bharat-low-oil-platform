# BLOC Partner Integration Guide

Complete guide for integrating your restaurant with the Bharat Low-Oil Campaign (BLOC) platform.

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Authentication Flow](#authentication-flow)
4. [API Endpoints](#api-endpoints)
5. [Code Examples](#code-examples)
6. [Webhook Integration](#webhook-integration)
7. [Error Handling](#error-handling)
8. [Rate Limiting](#rate-limiting)
9. [Best Practices](#best-practices)

---

## Overview

The BLOC Partner API allows restaurants to:
- Register and obtain API credentials
- Upload menu items for low-oil certification
- Check blockchain certification status
- Receive real-time notifications via webhooks
- Track API usage statistics

**Base URL (Production):** `https://api.bloc.gov.in/partner`  
**Base URL (Development):** `http://localhost:3006/api/partner`

---

## Getting Started

### Step 1: Register Your Restaurant

```bash
curl -X POST https://api.bloc.gov.in/partner/register \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": "rest_12345",
    "restaurantName": "Healthy Bites Restaurant",
    "email": "owner@healthybites.com",
    "phone": "+91-9876543210",
    "permissions": ["menu:read", "menu:write", "cert:read"]
  }'
```

**Response:**
```json
{
  "message": "Partner registered successfully",
  "partner": {
    "partnerId": "partner_a1b2c3d4e5f6g7h8",
    "restaurantId": "rest_12345",
    "restaurantName": "Healthy Bites Restaurant",
    "apiKey": "bloc_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p",
    "permissions": ["menu:read", "menu:write", "cert:read"],
    "rateLimit": 100
  },
  "warning": "Store this API key securely. It will not be shown again."
}
```

**⚠️ Important:** Save the `apiKey` immediately. It will never be displayed again.

---

## Authentication Flow

### 1. Store API Key Securely

```bash
# Environment variable (recommended)
export BLOC_API_KEY="bloc_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p"

# Or in .env file
BLOC_API_KEY=bloc_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
```

### 2. Get JWT Token

API keys should be exchanged for JWT tokens for authenticated requests.

```bash
curl -X POST https://api.bloc.gov.in/partner/auth/token \
  -H "X-API-Key: bloc_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p"
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h",
  "partner": {
    "partnerId": "partner_a1b2c3d4e5f6g7h8",
    "restaurantId": "rest_12345",
    "permissions": ["menu:read", "menu:write", "cert:read"]
  }
}
```

**Token Lifetime:** 24 hours. Refresh before expiry.

### 3. Use JWT for Authenticated Requests

```bash
curl -X POST https://api.bloc.gov.in/partner/menu/upload \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{ "items": [...] }'
```

---

## API Endpoints

### Menu Upload

Upload menu items to receive low-oil certification badges.

**Endpoint:** `POST /partner/menu/upload`

**Certification Criteria:**
- 🟢 **Low-Oil Certified:** Oil amount < 15ml per serving
- ❌ **Not Certified:** Oil amount ≥ 15ml per serving

**Request:**
```json
{
  "items": [
    {
      "name": "Grilled Paneer Tikka",
      "oilAmount": 12,
      "category": "Appetizers",
      "price": 280,
      "description": "Grilled cottage cheese with minimal oil"
    },
    {
      "name": "Steamed Momos",
      "oilAmount": 8,
      "category": "Appetizers",
      "price": 120
    },
    {
      "name": "Butter Chicken",
      "oilAmount": 35,
      "category": "Main Course",
      "price": 450
    }
  ]
}
```

**Response:**
```json
{
  "message": "Menu uploaded successfully",
  "restaurantId": "rest_12345",
  "summary": {
    "totalItems": 3,
    "lowOilCertified": 2,
    "certificationRate": 67,
    "uploadedAt": "2025-11-21T10:30:00.000Z"
  },
  "items": [
    {
      "name": "Grilled Paneer Tikka",
      "oilAmount": 12,
      "lowOilCertified": true,
      "certificationBadge": "🟢 BLOC Low-Oil Certified"
    },
    {
      "name": "Steamed Momos",
      "oilAmount": 8,
      "lowOilCertified": true,
      "certificationBadge": "🟢 BLOC Low-Oil Certified"
    },
    {
      "name": "Butter Chicken",
      "oilAmount": 35,
      "lowOilCertified": false,
      "certificationBadge": null
    }
  ]
}
```

### Check Certification

Query blockchain for restaurant certification status.

**Endpoint:** `POST /partner/certification/check`

**Request:**
```json
{
  "restaurantId": "rest_12345"
}
```

**Response:**
```json
{
  "message": "Certification retrieved successfully",
  "certification": {
    "restaurantId": "rest_12345",
    "certificateId": "CERT_rest_12345_1637491200000",
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

**Certification Levels:**
- 🥉 **Bronze:** 25-49% low-oil menu, score 60-69
- 🥈 **Silver:** 50-64% low-oil menu, score 70-79
- 🥇 **Gold:** 65-79% low-oil menu, score 80-89
- 💎 **Platinum:** 80%+ low-oil menu, score 90+

---

## Code Examples

### Node.js (with Axios)

```javascript
const axios = require('axios');

const BLOC_API_KEY = process.env.BLOC_API_KEY;
const BASE_URL = 'https://api.bloc.gov.in/partner';

class BLOCClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.token = null;
  }

  // Authenticate and get JWT
  async authenticate() {
    try {
      const response = await axios.post(`${BASE_URL}/auth/token`, null, {
        headers: { 'X-API-Key': this.apiKey }
      });
      this.token = response.data.token;
      return this.token;
    } catch (error) {
      console.error('Authentication failed:', error.response?.data);
      throw error;
    }
  }

  // Upload menu items
  async uploadMenu(items) {
    if (!this.token) await this.authenticate();

    try {
      const response = await axios.post(
        `${BASE_URL}/menu/upload`,
        { items },
        { headers: { Authorization: `Bearer ${this.token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Menu upload failed:', error.response?.data);
      throw error;
    }
  }

  // Check certification
  async checkCertification(restaurantId) {
    if (!this.token) await this.authenticate();

    try {
      const response = await axios.post(
        `${BASE_URL}/certification/check`,
        { restaurantId },
        { headers: { Authorization: `Bearer ${this.token}` } }
      );
      return response.data.certification;
    } catch (error) {
      console.error('Certification check failed:', error.response?.data);
      throw error;
    }
  }
}

// Usage
const client = new BLOCClient(BLOC_API_KEY);

// Upload menu
const menuItems = [
  { name: 'Grilled Chicken Salad', oilAmount: 10, category: 'Salads', price: 250 },
  { name: 'Steamed Fish', oilAmount: 12, category: 'Main Course', price: 400 }
];

client.uploadMenu(menuItems)
  .then(result => console.log('Menu uploaded:', result))
  .catch(err => console.error('Error:', err));

// Check certification
client.checkCertification('rest_12345')
  .then(cert => console.log('Certification:', cert))
  .catch(err => console.error('Error:', err));
```

### Python (with requests)

```python
import requests
import os
from typing import List, Dict

BLOC_API_KEY = os.environ.get('BLOC_API_KEY')
BASE_URL = 'https://api.bloc.gov.in/partner'

class BLOCClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.token = None

    def authenticate(self) -> str:
        """Get JWT token"""
        headers = {'X-API-Key': self.api_key}
        response = requests.post(f'{BASE_URL}/auth/token', headers=headers)
        response.raise_for_status()
        self.token = response.json()['token']
        return self.token

    def upload_menu(self, items: List[Dict]) -> Dict:
        """Upload menu items"""
        if not self.token:
            self.authenticate()
        
        headers = {'Authorization': f'Bearer {self.token}'}
        response = requests.post(
            f'{BASE_URL}/menu/upload',
            json={'items': items},
            headers=headers
        )
        response.raise_for_status()
        return response.json()

    def check_certification(self, restaurant_id: str) -> Dict:
        """Check blockchain certification"""
        if not self.token:
            self.authenticate()
        
        headers = {'Authorization': f'Bearer {self.token}'}
        response = requests.post(
            f'{BASE_URL}/certification/check',
            json={'restaurantId': restaurant_id},
            headers=headers
        )
        response.raise_for_status()
        return response.json()['certification']

# Usage
client = BLOCClient(BLOC_API_KEY)

# Upload menu
menu_items = [
    {'name': 'Grilled Paneer', 'oilAmount': 12, 'category': 'Appetizers', 'price': 280},
    {'name': 'Steamed Momos', 'oilAmount': 8, 'category': 'Appetizers', 'price': 120}
]

result = client.upload_menu(menu_items)
print(f"Uploaded {result['summary']['totalItems']} items")
print(f"Certification rate: {result['summary']['certificationRate']}%")

# Check certification
cert = client.check_certification('rest_12345')
print(f"Certification level: {cert['level']}, Score: {cert['score']}")
```

### cURL (Shell Script)

```bash
#!/bin/bash

BLOC_API_KEY="bloc_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p"
BASE_URL="https://api.bloc.gov.in/partner"

# Get JWT token
TOKEN=$(curl -s -X POST "$BASE_URL/auth/token" \
  -H "X-API-Key: $BLOC_API_KEY" | jq -r '.token')

echo "Token: $TOKEN"

# Upload menu
curl -X POST "$BASE_URL/menu/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"name": "Grilled Chicken", "oilAmount": 10, "price": 350},
      {"name": "Steamed Rice", "oilAmount": 5, "price": 80}
    ]
  }' | jq '.'

# Check certification
curl -X POST "$BASE_URL/certification/check" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"restaurantId": "rest_12345"}' | jq '.'
```

---

## Webhook Integration

### Subscribe to Webhooks

```bash
curl -X POST https://api.bloc.gov.in/partner/webhook/subscribe \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "webhookUrl": "https://restaurant.com/bloc-webhook",
    "events": ["certification_updated", "compliance_alert"]
  }'
```

**Response:**
```json
{
  "message": "Webhook subscribed successfully",
  "webhook": {
    "partnerId": "partner_a1b2c3d4e5f6g7h8",
    "restaurantId": "rest_12345",
    "webhookUrl": "https://restaurant.com/bloc-webhook",
    "events": ["certification_updated", "compliance_alert"],
    "secret": "whsec_a1b2c3d4e5f6g7h8i9j0",
    "subscribedAt": "2025-11-21T10:00:00.000Z",
    "isActive": true
  }
}
```

### Webhook Event Types

| Event | Description |
|-------|-------------|
| `certification_updated` | Restaurant certification level changed |
| `compliance_alert` | Compliance issue detected |
| `menu_sync` | Menu sync completed |
| `order_placed` | New order with low-oil items |

### Webhook Payload Example

```json
{
  "event": "certification_updated",
  "timestamp": "2025-11-21T10:30:00.000Z",
  "restaurantId": "rest_12345",
  "data": {
    "oldLevel": "Silver",
    "newLevel": "Gold",
    "score": 85,
    "certificateId": "CERT_rest_12345_1637491200000"
  }
}
```

### Verify Webhook Signature

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(payload));
  const expectedSignature = hmac.digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Express webhook endpoint
app.post('/bloc-webhook', (req, res) => {
  const signature = req.headers['x-bloc-signature'];
  const secret = 'whsec_a1b2c3d4e5f6g7h8i9j0';
  
  if (!verifyWebhookSignature(req.body, signature, secret)) {
    return res.status(401).send('Invalid signature');
  }
  
  console.log('Webhook event:', req.body.event);
  res.status(200).send('OK');
});
```

---

## Error Handling

### Common Error Responses

| Status Code | Error | Description |
|------------|-------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid API key/token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate resource |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 502 | Bad Gateway | Downstream service unavailable |

### Error Response Format

```json
{
  "error": "Invalid API key",
  "details": "The provided API key is not valid or has been revoked"
}
```

### Retry Strategy

```javascript
async function uploadMenuWithRetry(client, items, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await client.uploadMenu(items);
    } catch (error) {
      if (error.response?.status === 429) {
        // Rate limit - exponential backoff
        const delay = Math.pow(2, i) * 1000;
        console.log(`Rate limited. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else if (error.response?.status >= 500) {
        // Server error - retry
        console.log(`Server error. Retry ${i + 1}/${maxRetries}...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        // Client error - don't retry
        throw error;
      }
    }
  }
  throw new Error('Max retries exceeded');
}
```

---

## Rate Limiting

**Default Limits:**
- 100 requests per 15 minutes per API key
- 10 authentication attempts per 15 minutes

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1637491200
```

**429 Response:**
```json
{
  "error": "Too many requests from this API key, please try again later.",
  "retryAfter": "15 minutes"
}
```

---

## Best Practices

### 1. Security
- Store API keys in environment variables, never in code
- Use HTTPS for all API calls
- Verify webhook signatures
- Rotate API keys periodically

### 2. Performance
- Cache JWT tokens (valid for 24h)
- Implement exponential backoff for retries
- Batch menu uploads when possible
- Use webhooks instead of polling

### 3. Error Handling
- Log all API errors for debugging
- Implement graceful degradation
- Show user-friendly error messages
- Monitor API usage stats endpoint

### 4. Compliance
- Keep oil amount calculations accurate
- Update menu regularly (daily/weekly)
- Respond to compliance alerts promptly
- Maintain certification documentation

---

## Support

**API Documentation:** https://api.bloc.gov.in/docs  
**Developer Portal:** https://bloc.gov.in/developers  
**Email:** api-support@bloc.gov.in  
**Phone:** +91-11-2345-6789

---

## Changelog

**v1.0.0** (2025-11-21)
- Initial release
- Menu upload and certification
- Blockchain verification
- Webhook support

---

**Government of India**  
**Ministry of Food & Welfare**  
**Bharat Low-Oil Campaign**
