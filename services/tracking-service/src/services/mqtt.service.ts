import mqtt from 'mqtt';
import OilLog from '../models/OilLog.model';

let client: mqtt.MqttClient | null = null;

export const initMQTT = (): void => {
  const brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
  
  client = mqtt.connect(brokerUrl, {
    clientId: `tracking-service-${Math.random().toString(16).slice(2, 8)}`,
    clean: true,
    reconnectPeriod: 5000
  });

  client.on('connect', () => {
    console.log('✅ Connected to MQTT broker');
    client?.subscribe('oil-bottle/weight', (err) => {
      if (err) {
        console.error('MQTT subscription error:', err);
      } else {
        console.log('📡 Subscribed to oil-bottle/weight topic');
      }
    });
  });

  client.on('message', async (topic, message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('Received IoT data:', data);

      // Process weight data from smart oil bottle
      if (topic === 'oil-bottle/weight' && data.deviceId && data.weight !== undefined) {
        await processWeightData(data);
      }
    } catch (error) {
      console.error('Error processing MQTT message:', error);
    }
  });

  client.on('error', (error) => {
    console.error('MQTT error:', error);
  });
};

async function processWeightData(data: any): Promise<void> {
  try {
    // Get previous weight reading for this device
    const lastLog = await OilLog.findOne({ 
      deviceId: data.deviceId, 
      source: 'iot' 
    }).sort({ createdAt: -1 });

    if (lastLog) {
      const previousWeight = lastLog.amount;
      const currentWeight = data.weight;
      
      // Calculate oil consumed (if weight decreased)
      const consumed = previousWeight - currentWeight;
      
      if (consumed > 0 && consumed < 2000) { // Sanity check (max 2L consumption)
        const log = new OilLog({
          userId: data.userId || 'iot-user', // Should be mapped from deviceId
          amount: consumed,
          oilType: data.oilType || 'sunflower',
          date: new Date(),
          source: 'iot',
          deviceId: data.deviceId,
          notes: `Auto-logged from IoT device. Previous: ${previousWeight}ml, Current: ${currentWeight}ml`
        });

        await log.save();
        console.log(`✅ IoT log created: ${consumed}ml consumed`);
      }
    } else {
      // First reading, just store the weight
      const log = new OilLog({
        userId: data.userId || 'iot-user',
        amount: data.weight,
        oilType: data.oilType || 'sunflower',
        date: new Date(),
        source: 'iot',
        deviceId: data.deviceId,
        notes: 'Initial weight reading'
      });

      await log.save();
      console.log(`✅ Initial IoT weight recorded: ${data.weight}ml`);
    }
  } catch (error) {
    console.error('Error processing weight data:', error);
  }
}

export const disconnectMQTT = (): void => {
  if (client) {
    client.end();
    console.log('MQTT client disconnected');
  }
};
