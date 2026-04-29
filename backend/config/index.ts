import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const config = {
  // Server Configuration
  port: parseInt(process.env.PORT || '5174', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV !== 'production',

  // CORS Configuration
  corsOrigin: process.env.FRONTEND_URL || 'http://localhost:5173',

  // Database Configuration
  databaseUrl: process.env.DATABASE_URL as string,

  // Logging Configuration
  logLevel: process.env.LOG_LEVEL || 'info',

  // Rate Limiting Configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  // Legacy file path (consider removing)
  dataFile: path.resolve(__dirname, '../../items.json'),
} as const;

export default config;
