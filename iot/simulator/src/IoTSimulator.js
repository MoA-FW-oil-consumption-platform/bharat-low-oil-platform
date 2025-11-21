const mqtt = require('mqtt');
require('dotenv').config();

const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
const MQTT_TOPIC_WEIGHT = process.env.MQTT_TOPIC_WEIGHT || 'oil-bottle/weight';
const MQTT_TOPIC_STATUS = process.env.MQTT_TOPIC_STATUS || 'oil-bottle/status';
const MQTT_TOPIC_ALERT = process.env.MQTT_TOPIC_ALERT || 'oil-bottle/alert';

const SIMULATION_INTERVAL = parseInt(process.env.SIMULATION_INTERVAL) || 5000;
const INITIAL_BOTTLE_WEIGHT = parseInt(process.env.INITIAL_BOTTLE_WEIGHT) || 1000;
const MIN_BOTTLE_WEIGHT = parseInt(process.env.MIN_BOTTLE_WEIGHT) || 50;
const CONSUMPTION_RATE_MIN = parseInt(process.env.CONSUMPTION_RATE_MIN) || 10;
const CONSUMPTION_RATE_MAX = parseInt(process.env.CONSUMPTION_RATE_MAX) || 50;

class IoTSimulator {
  constructor(deviceId) {
    this.deviceId = deviceId || `DEVICE-${Date.now()}`;
    this.client = null;
    this.currentWeight = INITIAL_BOTTLE_WEIGHT;
    this.isConnected = false;
    this.simulationInterval = null;
  }

  connect() {
    console.log(`🔌 Connecting device ${this.deviceId} to ${MQTT_BROKER_URL}...`);

    this.client = mqtt.connect(MQTT_BROKER_URL, {
      clientId: `${process.env.MQTT_CLIENT_ID_PREFIX || 'bharat-iot'}-${this.deviceId}`,
      clean: true,
      reconnectPeriod: 1000,
    });

    this.client.on('connect', () => {
      console.log(`✅ Device ${this.deviceId} connected to MQTT broker`);
      this.isConnected = true;
      this.publishStatus('online');
      this.startSimulation();
    });

    this.client.on('error', (error) => {
      console.error(`❌ MQTT Error for ${this.deviceId}:`, error.message);
    });

    this.client.on('close', () => {
      console.log(`🔌 Device ${this.deviceId} disconnected from MQTT broker`);
      this.isConnected = false;
    });

    this.client.on('reconnect', () => {
      console.log(`🔄 Device ${this.deviceId} attempting to reconnect...`);
    });
  }

  publishStatus(status) {
    if (!this.isConnected) return;

    const statusMessage = {
      deviceId: this.deviceId,
      status: status,
      timestamp: new Date().toISOString(),
    };

    this.client.publish(
      MQTT_TOPIC_STATUS,
      JSON.stringify(statusMessage),
      { qos: 1 },
      (err) => {
        if (err) {
          console.error(`❌ Failed to publish status for ${this.deviceId}:`, err.message);
        }
      }
    );
  }

  publishWeight(weight) {
    if (!this.isConnected) return;

    const weightMessage = {
      deviceId: this.deviceId,
      weight: Math.round(weight * 100) / 100, // Round to 2 decimal places
      unit: 'ml',
      timestamp: new Date().toISOString(),
    };

    this.client.publish(
      MQTT_TOPIC_WEIGHT,
      JSON.stringify(weightMessage),
      { qos: 1 },
      (err) => {
        if (!err) {
          console.log(
            `📊 [${this.deviceId}] Weight: ${weightMessage.weight}ml`
          );
        } else {
          console.error(`❌ Failed to publish weight for ${this.deviceId}:`, err.message);
        }
      }
    );
  }

  publishAlert(alertType, message) {
    if (!this.isConnected) return;

    const alertMessage = {
      deviceId: this.deviceId,
      alertType: alertType,
      message: message,
      currentWeight: this.currentWeight,
      timestamp: new Date().toISOString(),
    };

    this.client.publish(
      MQTT_TOPIC_ALERT,
      JSON.stringify(alertMessage),
      { qos: 1 },
      (err) => {
        if (!err) {
          console.log(`⚠️  [${this.deviceId}] ALERT: ${alertType} - ${message}`);
        }
      }
    );
  }

  simulateConsumption() {
    // Simulate random consumption
    const consumption = Math.random() * (CONSUMPTION_RATE_MAX - CONSUMPTION_RATE_MIN) + CONSUMPTION_RATE_MIN;
    
    this.currentWeight -= consumption;

    // Check for low level
    if (this.currentWeight <= MIN_BOTTLE_WEIGHT && this.currentWeight + consumption > MIN_BOTTLE_WEIGHT) {
      this.publishAlert('low_level', `Oil bottle is running low (${Math.round(this.currentWeight)}ml remaining)`);
    }

    // Check for refill (weight increases significantly)
    if (this.currentWeight < MIN_BOTTLE_WEIGHT) {
      // Simulate refill
      const shouldRefill = Math.random() < 0.3; // 30% chance of refill
      if (shouldRefill) {
        const refillAmount = Math.random() * 500 + 500; // 500-1000ml
        this.currentWeight += refillAmount;
        console.log(`🔄 [${this.deviceId}] Bottle refilled: +${Math.round(refillAmount)}ml`);
        this.publishAlert('refill_detected', `Oil bottle refilled with ${Math.round(refillAmount)}ml`);
      }
    }

    // Ensure weight doesn't go negative
    if (this.currentWeight < 0) {
      this.currentWeight = 0;
      this.publishAlert('empty', 'Oil bottle is empty');
    }

    // Publish current weight
    this.publishWeight(this.currentWeight);
  }

  startSimulation() {
    console.log(`🚀 Starting simulation for device ${this.deviceId}`);
    console.log(`   Initial weight: ${this.currentWeight}ml`);
    console.log(`   Interval: ${SIMULATION_INTERVAL}ms`);

    this.simulationInterval = setInterval(() => {
      this.simulateConsumption();
    }, SIMULATION_INTERVAL);
  }

  stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
      console.log(`⏹️  Simulation stopped for device ${this.deviceId}`);
    }
  }

  disconnect() {
    this.stopSimulation();
    
    if (this.client) {
      this.publishStatus('offline');
      this.client.end(false, () => {
        console.log(`👋 Device ${this.deviceId} disconnected gracefully`);
      });
    }
  }
}

module.exports = IoTSimulator;
