import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import rewardRoutes from './routes/reward.routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3005;

// Connect to MongoDB
connectDB();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', service: 'reward-service' });
});

app.use('/rewards', rewardRoutes);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🎁 Reward Service running on port ${PORT}`);
});

export default app;
