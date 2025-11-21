const IoTSimulator = require('./IoTSimulator');

console.log('🌟 Bharat Low Oil Platform - IoT Simulator');
console.log('==========================================\n');

// Create a single device simulator
const deviceId = process.env.DEVICE_ID || `DEVICE-${Date.now()}`;
const simulator = new IoTSimulator(deviceId);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down simulator...');
  simulator.disconnect();
  setTimeout(() => {
    process.exit(0);
  }, 1000);
});

process.on('SIGTERM', () => {
  console.log('\n\n🛑 Shutting down simulator...');
  simulator.disconnect();
  setTimeout(() => {
    process.exit(0);
  }, 1000);
});

// Start the simulator
simulator.connect();

console.log('\n💡 Press Ctrl+C to stop the simulator\n');
