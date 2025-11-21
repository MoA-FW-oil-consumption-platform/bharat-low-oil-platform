import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import trackingRoutes from './routes/tracking.routes';
import institutionalRoutes from './routes/institutional.routes';
import { errorHandler } from './middleware/errorHandler';
import { initMQTT } from './services/mqtt.service';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3003;

// Connect to MongoDB
connectDB();

// Initialize MQTT client for IoT
if (process.env.ENABLE_IOT === 'true') {
  initMQTT();
}

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', service: 'tracking-service' });
});

app.use('/tracking', trackingRoutes);
app.use('/institutional', institutionalRoutes);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`📊 Tracking Service running on port ${PORT}`);
});

export default app;
