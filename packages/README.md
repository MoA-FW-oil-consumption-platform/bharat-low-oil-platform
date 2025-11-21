# Shared Packages

Monorepo shared packages for code reuse across all apps and services.

## Packages

### 📦 @bharat-low-oil/shared-types

TypeScript types and interfaces used across the platform.

**Key Types:**
- `User`, `OilLog`, `Recipe`, `Restaurant`, `Campaign`
- `ApiResponse`, `PaginatedResponse`
- `BlockchainCertificate`, `WeightSensorData`
- Constants: `ICMR_RECOMMENDED_OIL`, `OIL_TYPES`, `POINTS`, etc.

**Usage:**
```typescript
import type { User, OilLog, ApiResponse } from '@bharat-low-oil/shared-types';
import { ICMR_DAILY_LIMIT, POINTS } from '@bharat-low-oil/shared-types/constants';
```

### 🛠️ @bharat-low-oil/utils

Utility functions for common operations.

**Modules:**
- **date.ts**: Date formatting, relative time, date ranges
- **validation.ts**: Email, phone, pincode, password validation
- **formatting.ts**: Number, currency, percentage formatting
- **calculations.ts**: Oil consumption calculations, health status, points
- **api.ts**: API request helpers, error handling, retry logic

**Usage:**
```typescript
import { 
  formatDate, 
  isValidEmail, 
  formatOilAmount,
  calculateDailyAverage,
  buildUrl 
} from '@bharat-low-oil/utils';

// Date formatting
formatDate(new Date(), 'en-IN'); // "21 November 2025"
formatRelativeTime(yesterday); // "1 day ago"

// Validation
isValidEmail('user@example.com'); // true
isValidPhone('9876543210'); // true

// Formatting
formatOilAmount(1500); // "1.50L"
formatCurrency(15000); // "₹15,000"

// Calculations
calculateDailyAverage(logs, 30); // 45.5
calculateHealthStatus(50, 4); // "healthy"
```

### 🎨 @bharat-low-oil/ui-components

Shared React Native UI components.

**Components:**
- `Badge`: Status badges with variants (success, warning, error, info)
- `StatCard`: Statistics display cards
- `LoadingSpinner`: Loading indicators
- `ErrorMessage`: Error display component
- `EmptyState`: Empty state placeholder

**Usage:**
```typescript
import { Badge, StatCard, LoadingSpinner } from '@bharat-low-oil/ui-components';

// Badge
<Badge text="Active" variant="success" size="medium" />

// Stat Card
<StatCard
  title="Daily Consumption"
  value="45.2ml"
  subtitle="Below ICMR limit"
  variant="success"
/>

// Loading
<LoadingSpinner size="large" color="#10B981" />
```

## Development

### Build All Packages

```bash
cd packages
npm run build # (if you add this script to each package)
```

Or build individually:

```bash
cd packages/shared-types && npm run build
cd packages/utils && npm run build
cd packages/ui-components && npm run build
```

### Watch Mode

```bash
cd packages/shared-types && npm run dev
```

### Type Checking

```bash
npm run type-check
```

## Integration

### Mobile App

```typescript
// apps/mobile-app/app/(tabs)/index.tsx
import type { User, OilLog } from '@bharat-low-oil/shared-types';
import { formatOilAmount, calculateDailyAverage } from '@bharat-low-oil/utils';
import { StatCard, Badge } from '@bharat-low-oil/ui-components';
```

### Backend Services

```typescript
// services/user-service/src/controllers/userController.ts
import type { User, ApiResponse } from '@bharat-low-oil/shared-types';
import { isValidEmail, sanitizeInput } from '@bharat-low-oil/utils';
```

### Web Portals

```typescript
// apps/admin-dashboard/app/dashboard/page.tsx
import type { AnalyticsData } from '@bharat-low-oil/shared-types';
import { formatPercentage, formatDate } from '@bharat-low-oil/utils';
```

## Structure

```
packages/
├── shared-types/
│   ├── src/
│   │   ├── index.ts          # All TypeScript interfaces
│   │   └── constants.ts      # Constants and enums
│   ├── package.json
│   └── tsconfig.json
├── utils/
│   ├── src/
│   │   ├── date.ts           # Date utilities
│   │   ├── validation.ts     # Input validation
│   │   ├── formatting.ts     # Display formatting
│   │   ├── calculations.ts   # Oil calculations
│   │   ├── api.ts            # API helpers
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
└── ui-components/
    ├── src/
    │   ├── Badge.tsx
    │   ├── StatCard.tsx
    │   ├── LoadingSpinner.tsx
    │   ├── ErrorMessage.tsx
    │   ├── EmptyState.tsx
    │   └── index.ts
    ├── package.json
    └── tsconfig.json
```

## Best Practices

1. **Type Safety**: Always use TypeScript types from `shared-types`
2. **Validation**: Use validators before processing user input
3. **Formatting**: Use formatters for consistent display
4. **Components**: Reuse UI components across mobile and web (React Native Web)
5. **Constants**: Use shared constants instead of hardcoding values

## Examples

### Complete Flow Example

```typescript
import type { User, OilLog, ApiResponse } from '@bharat-low-oil/shared-types';
import { 
  isValidEmail, 
  formatOilAmount, 
  calculateDailyAverage,
  calculateHealthStatus 
} from '@bharat-low-oil/utils';
import { StatCard, Badge } from '@bharat-low-oil/ui-components';

// 1. Validate input
if (!isValidEmail(email)) {
  throw new Error('Invalid email');
}

// 2. Calculate statistics
const dailyAvg = calculateDailyAverage(logs, 30);
const healthStatus = calculateHealthStatus(dailyAvg, user.familySize);

// 3. Format for display
const formattedAmount = formatOilAmount(dailyAvg);

// 4. Render UI
<StatCard
  title="Daily Average"
  value={formattedAmount}
  variant={healthStatus === 'healthy' ? 'success' : 'warning'}
/>
<Badge 
  text={healthStatus === 'healthy' ? 'Healthy' : 'Needs Improvement'} 
  variant={healthStatus === 'healthy' ? 'success' : 'warning'}
/>
```

## License

Part of Bharat Low Oil Platform - Government of India Initiative
