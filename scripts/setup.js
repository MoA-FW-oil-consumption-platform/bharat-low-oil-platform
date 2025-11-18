#!/usr/bin/env node

/**
 * Bharat Low Oil Platform - Project Setup Script
 * This script generates all necessary files and folders for the project
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.join(__dirname, '..');

console.log('🇮🇳 Bharat Low Oil Platform - Setup Script\n');
console.log('Creating project structure...\n');

// Helper function to create directory
function createDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✓ Created: ${dirPath}`);
  }
}

// Helper function to create file
function createFile(filePath, content) {
  const dir = path.dirname(filePath);
  createDir(dir);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Created: ${filePath}`);
  }
}

// Create mobile app structure
const mobileAppDirs = [
  'apps/mobile-app/src/api',
  'apps/mobile-app/src/components/common',
  'apps/mobile-app/src/components/dashboard',
  'apps/mobile-app/src/components/tracking',
  'apps/mobile-app/src/components/recipes',
  'apps/mobile-app/src/components/rewards',
  'apps/mobile-app/src/navigation',
  'apps/mobile-app/src/screens/auth',
  'apps/mobile-app/src/screens/dashboard',
  'apps/mobile-app/src/screens/tracking',
  'apps/mobile-app/src/screens/recipes',
  'apps/mobile-app/src/screens/rewards',
  'apps/mobile-app/src/screens/profile',
  'apps/mobile-app/src/screens/settings',
  'apps/mobile-app/src/store',
  'apps/mobile-app/src/types',
  'apps/mobile-app/src/utils',
  'apps/mobile-app/assets/images',
  'apps/mobile-app/assets/icons',
];

// Create backend services structure
const services = ['auth-service', 'user-service', 'tracking-service', 'reward-service', 'partnership-service', 'api-gateway'];
const backendDirs = [];

services.forEach(service => {
  backendDirs.push(
    `services/${service}/src/controllers`,
    `services/${service}/src/routes`,
    `services/${service}/src/models`,
    `services/${service}/src/middleware`,
    `services/${service}/src/utils`,
    `services/${service}/src/config`,
    `services/${service}/tests`
  );
});

// AI Service (Python)
const aiServiceDirs = [
  'services/ai-service/app/models',
  'services/ai-service/app/routers',
  'services/ai-service/app/schemas',
  'services/ai-service/app/utils',
  'services/ai-service/tests',
];

// Web portals
const webPortalDirs = [
  'apps/admin-dashboard/src/app',
  'apps/admin-dashboard/src/components',
  'apps/admin-dashboard/src/lib',
  'apps/admin-dashboard/public',
  'apps/restaurant-portal/src/app',
  'apps/restaurant-portal/src/components',
  'apps/restaurant-portal/src/lib',
  'apps/restaurant-portal/public',
];

// Shared packages
const sharedPackageDirs = [
  'packages/shared-types/src',
  'packages/ui-components/src',
  'packages/utils/src',
];

// Blockchain
const blockchainDirs = [
  'blockchain/contracts',
  'blockchain/scripts',
  'blockchain/test',
];

// IoT
const iotDirs = [
  'iot/simulator/src',
  'iot/esp32-firmware/src',
];

// Infrastructure
const infraDirs = [
  'infra/docker',
  'infra/scripts',
  'infra/mosquitto/config',
  'infra/mosquitto/data',
  'infra/mosquitto/log',
];

// Docs
const docsDirs = [
  'docs/api-specs',
  'docs/architecture',
  'docs/deployment',
];

// Create all directories
const allDirs = [
  ...mobileAppDirs,
  ...backendDirs,
  ...aiServiceDirs,
  ...webPortalDirs,
  ...sharedPackageDirs,
  ...blockchainDirs,
  ...iotDirs,
  ...infraDirs,
  ...docsDirs,
];

console.log('\n📁 Creating directory structure...\n');
allDirs.forEach(dir => createDir(path.join(ROOT_DIR, dir)));

console.log('\n✅ Project structure created successfully!\n');
console.log('📝 Next steps:\n');
console.log('1. Copy .env.example to .env and fill in your credentials');
console.log('2. Install dependencies: npm install');
console.log('3. Set up Supabase project and MongoDB Atlas cluster');
console.log('4. Start development: npm run dev\n');
console.log('📚 Read the README.md for detailed instructions\n');
