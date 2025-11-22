import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import policyRoutes from './routes/policy.routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3008;

// Connect to MongoDB
connectDB();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'policy-service',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/policy', policyRoutes);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`📊 Policy Service running on port ${PORT}`);
  console.log(`🔗 GST Dashboard: http://localhost:${PORT}/api/policy`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  process.exit(0);
});

export default app;
