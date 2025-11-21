const IoTSimulator = require('../IoTSimulator');

console.log('🌟 Single Device Simulator');
console.log('==========================\n');

// Create a single device
const deviceId = process.argv[2] || `DEVICE-SINGLE-${Date.now()}`;
const simulator = new IoTSimulator(deviceId);

// Connect the device
simulator.connect();

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down...');
  simulator.disconnect();
  setTimeout(() => process.exit(0), 1000);
});

console.log('\n💡 Simulating single oil bottle weight sensor');
console.log('💡 Press Ctrl+C to stop\n');
