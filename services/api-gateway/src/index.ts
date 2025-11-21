import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";
import { rateLimiter } from "./middleware/rateLimiter";
import { authMiddleware } from "./middleware/auth";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app: Application = express();
const PORT = process.env.API_GATEWAY_PORT || 3000;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    credentials: true,
  })
);
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(rateLimiter);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Service routes with authentication
const services = [
  {
    path: "/api/auth",
    target: process.env.AUTH_SERVICE_URL || "http://localhost:3001",
    auth: false,
  },
  {
    path: "/api/users",
    target: process.env.USER_SERVICE_URL || "http://localhost:3002",
    auth: true,
  },
  {
    path: "/api/tracking",
    target: process.env.TRACKING_SERVICE_URL || "http://localhost:3003",
    auth: true,
  },
  {
    path: "/api/ai",
    target: process.env.AI_SERVICE_URL || "http://localhost:3004",
    auth: true,
  },
  {
    path: "/api/rewards",
    target: process.env.REWARD_SERVICE_URL || "http://localhost:3005",
    auth: true,
  },
  {
    path: "/api/partnerships",
    target: process.env.PARTNERSHIP_SERVICE_URL || "http://localhost:3006",
    auth: true,
  },
];

// Register service proxies
services.forEach((service) => {
  const middleware = service.auth
    ? [
        authMiddleware,
        createProxyMiddleware({
          target: service.target,
          changeOrigin: true,
          pathRewrite: {
            [`^${service.path}`]: "",
          },
          onError: (err, _req, res) => {
            console.error(`Proxy error for ${service.path}:`, err);
            res.status(503).json({ error: "Service unavailable" });
          },
        }),
      ]
    : [
        createProxyMiddleware({
          target: service.target,
          changeOrigin: true,
          pathRewrite: {
            [`^${service.path}`]: "",
          },
        }),
      ];

  app.use(service.path, ...middleware);
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔐 Authentication: Enabled`);
  console.log(`⚡ Rate limiting: Active`);
});

export default app;
