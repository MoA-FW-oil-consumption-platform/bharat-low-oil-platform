# Restaurant Portal - Bharat Low Oil Platform

Self-service portal for restaurants to apply for low-oil certification and manage their certified menu.

## Features

### 1. **Dashboard**
- Quick actions (Add dish, Apply for certification, View certificate)
- Stats overview (Total dishes, Low-oil dishes, Customer views, Certificate status)
- Certification status card with compliance percentage
- Recent orders with oil amount per serving

### 2. **Menu Management**
- Add new dishes with oil amount
- Edit existing dishes
- Mark dishes as low-oil certified
- Upload dish images
- Track customer views and orders

### 3. **Certification**
- Apply for government low-oil certification
- Upload required documents
- Track application status
- View certification benefits
- Application history

### 4. **Certificate**
- View official certificate with QR code
- Download as PDF
- Share on social media
- Blockchain verification link
- Certificate details (ID, level, validity)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **QR Code**: qrcode.react
- **File Upload**: react-dropzone
- **State**: Zustand
- **API**: React Query + Axios
- **Icons**: Lucide React

## Setup

```bash
cd apps/restaurant-portal
npm install
cp .env.example .env.local
npm run dev
```

Access at: http://localhost:3200

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_BLOCKCHAIN_VERIFY_URL=https://amoy.polygonscan.com/tx/
```

## Routes

- `/dashboard` - Main dashboard
- `/dashboard/menu` - Menu management
- `/dashboard/certification` - Apply for certification
- `/dashboard/certificate` - View certificate
- `/dashboard/settings` - Restaurant settings

## Certificate Design

The certificate includes:
- Government of India header
- Restaurant name and location
- Certificate ID and blockchain verification QR code
- Certification level (Bronze/Silver/Gold)
- Validity period
- ICMR compliance badge

## License

Part of Bharat Low Oil Platform - Government of India Initiative
