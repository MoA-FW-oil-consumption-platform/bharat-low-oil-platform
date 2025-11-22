import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import deliveryRoutes from './routes/delivery.routes';
import partnerRoutes from './routes/partner.routes';
import certificationRoutes from './routes/certification.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3006;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bloc-partnerships';

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'partnership-service',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/partnerships/api/integrations', deliveryRoutes);
app.use('/partnerships/api/partner', partnerRoutes);
app.use('/partnerships/api/certifications', certificationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// Database connection
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    const server = app.listen(PORT, () => {
      console.log(`🚀 Partnership Service running on port ${PORT}`);
      console.log(`📊 Delivery Integrations: http://localhost:${PORT}/api/integrations`);
      console.log(`🔗 Partner APIs: http://localhost:${PORT}/api/partner`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully');
      server.close(() => {
        mongoose.connection.close(false).then(() => {
          process.exit(0);
        });
      });
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

export default app;
