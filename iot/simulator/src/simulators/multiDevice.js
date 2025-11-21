const IoTSimulator = require('../IoTSimulator');

const DEVICE_COUNT = parseInt(process.env.DEVICE_COUNT) || 5;

console.log('🌟 Multi-Device Simulator');
console.log('=========================\n');
console.log(`📱 Simulating ${DEVICE_COUNT} devices\n`);

// Create multiple devices
const simulators = [];

for (let i = 0; i < DEVICE_COUNT; i++) {
  const deviceId = `DEVICE-MULTI-${i + 1}`;
  const simulator = new IoTSimulator(deviceId);
  
  // Stagger connection by 500ms to avoid overwhelming the broker
  setTimeout(() => {
    simulator.connect();
  }, i * 500);

  simulators.push(simulator);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down all simulators...');
  
  simulators.forEach((sim, index) => {
    setTimeout(() => {
      sim.disconnect();
    }, index * 200);
  });

  setTimeout(() => {
    process.exit(0);
  }, (simulators.length * 200) + 1000);
});

console.log('\n💡 Simulating multiple oil bottle weight sensors');
console.log('💡 Press Ctrl+C to stop all simulators\n');
