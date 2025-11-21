# IoT Simulator - MQTT Weight Sensor

Simulates smart oil bottle weight sensors using MQTT protocol for testing the tracking service.

## Features

- **Real-time Weight Simulation**: Simulates gradual oil consumption
- **MQTT Publishing**: Publishes weight data to `oil-bottle/weight` topic
- **Smart Refill Detection**: Automatically detects and reports refills
- **Low-Level Alerts**: Sends alerts when oil is running low
- **Multi-Device Support**: Can simulate multiple devices simultaneously
- **Graceful Shutdown**: Properly disconnects on exit

## How It Works

1. **Initial State**: Starts with 1000ml (configurable)
2. **Consumption**: Randomly consumes 10-50ml every 5 seconds
3. **Low Alert**: Triggers when weight drops below 50ml
4. **Auto-Refill**: 30% chance of refilling when below 50ml
5. **Weight Publishing**: Sends weight data via MQTT

## Setup

```bash
cd iot/simulator
npm install
cp .env.example .env
```

## Configuration

Edit `.env`:

```env
MQTT_BROKER_URL=mqtt://localhost:1883
SIMULATION_INTERVAL=5000                  # Publish interval (ms)
INITIAL_BOTTLE_WEIGHT=1000               # Starting weight (ml)
MIN_BOTTLE_WEIGHT=50                     # Low-level threshold (ml)
CONSUMPTION_RATE_MIN=10                  # Min consumption per cycle (ml)
CONSUMPTION_RATE_MAX=50                  # Max consumption per cycle (ml)
DEVICE_COUNT=5                           # Number of devices for multi-sim
```

## Usage

### Single Device

```bash
npm start
```

or

```bash
npm run simulate:single
```

Output:
```
🌟 Bharat Low Oil Platform - IoT Simulator
==========================================

🔌 Connecting device DEVICE-1234567890 to mqtt://localhost:1883...
✅ Device DEVICE-1234567890 connected to MQTT broker
🚀 Starting simulation for device DEVICE-1234567890
   Initial weight: 1000ml
   Interval: 5000ms

📊 [DEVICE-1234567890] Weight: 965.34ml
📊 [DEVICE-1234567890] Weight: 932.18ml
⚠️  [DEVICE-1234567890] ALERT: low_level - Oil bottle is running low (45ml remaining)
🔄 [DEVICE-1234567890] Bottle refilled: +750ml
```

### Multiple Devices

```bash
npm run simulate:multi
```

This will start 5 simulators (configurable via `DEVICE_COUNT`)

### Custom Device ID

```bash
DEVICE_ID=KITCHEN-001 npm start
```

## MQTT Topics

### Weight Data: `oil-bottle/weight`

```json
{
  "deviceId": "DEVICE-1234567890",
  "weight": 965.34,
  "unit": "ml",
  "timestamp": "2025-11-21T12:00:00.000Z"
}
```

### Status: `oil-bottle/status`

```json
{
  "deviceId": "DEVICE-1234567890",
  "status": "online",
  "timestamp": "2025-11-21T12:00:00.000Z"
}
```

### Alerts: `oil-bottle/alert`

```json
{
  "deviceId": "DEVICE-1234567890",
  "alertType": "low_level",
  "message": "Oil bottle is running low (45ml remaining)",
  "currentWeight": 45,
  "timestamp": "2025-11-21T12:00:00.000Z"
}
```

## Testing with Tracking Service

1. **Start MQTT Broker** (Mosquitto):
   ```bash
   docker-compose up mosquitto
   ```

2. **Start Tracking Service**:
   ```bash
   cd services/tracking-service
   npm run dev
   ```

3. **Start IoT Simulator**:
   ```bash
   cd iot/simulator
   npm start
   ```

4. **Verify Integration**:
   - Check tracking service logs for automatic oil log creation
   - Query `/api/tracking/:userId/logs` to see logged consumption

## Architecture

```
┌─────────────────┐
│  IoT Simulator  │
│  (Node.js)      │
└────────┬────────┘
         │ MQTT
         ├─> oil-bottle/weight
         ├─> oil-bottle/status
         └─> oil-bottle/alert
         │
         v
┌─────────────────┐
│ Mosquitto MQTT  │
│    Broker       │
└────────┬────────┘
         │
         v
┌─────────────────┐
│ Tracking Service│
│ (subscribes)    │
└─────────────────┘
```

## Development

### Watch Mode

```bash
npm run dev
```

### Custom Configuration

```bash
MQTT_BROKER_URL=mqtt://192.168.1.100:1883 \
SIMULATION_INTERVAL=3000 \
INITIAL_BOTTLE_WEIGHT=500 \
npm start
```

## Docker

### Build

```bash
docker build -t iot-simulator .
```

### Run

```bash
docker run -e MQTT_BROKER_URL=mqtt://host.docker.internal:1883 iot-simulator
```

## Real Hardware Integration

This simulator mimics the behavior of real IoT weight sensors. To integrate actual hardware:

1. **ESP32 with HX711 Load Cell**:
   - Connect HX711 to ESP32
   - Read weight from load cell
   - Publish to same MQTT topics
   - Use same JSON format

2. **Example ESP32 Code** (Arduino):
   ```cpp
   #include <WiFi.h>
   #include <PubSubClient.h>
   #include <HX711.h>

   // MQTT
   WiFiClient espClient;
   PubSubClient client(espClient);

   // Load Cell
   HX711 scale;

   void publishWeight(float weight) {
     String payload = "{";
     payload += "\"deviceId\":\"ESP32-001\",";
     payload += "\"weight\":" + String(weight) + ",";
     payload += "\"unit\":\"ml\",";
     payload += "\"timestamp\":\"" + getTimestamp() + "\"";
     payload += "}";
     
     client.publish("oil-bottle/weight", payload.c_str());
   }
   ```

## Troubleshooting

### Issue: "Connection refused"
**Solution**: Ensure Mosquitto MQTT broker is running:
```bash
docker-compose up mosquitto
```

### Issue: "Too many messages"
**Solution**: Increase `SIMULATION_INTERVAL` to reduce frequency

### Issue: "Weight goes negative"
**Solution**: This is handled automatically - weight stops at 0 and alerts are sent

## Production Considerations

- Use secure MQTT (TLS/SSL) for production
- Implement device authentication
- Add data validation
- Monitor connection health
- Implement retry logic with exponential backoff
- Use MQTT QoS 1 or 2 for critical messages
- Store device credentials securely

## License

Part of Bharat Low Oil Platform - Government of India Initiative
