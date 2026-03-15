import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file for local development; on Vercel, env vars are set in the dashboard
const envPath = path.join(__dirname, '..', '..', 'config', 'config.env');
dotenv.config({ path: envPath });

const required = ['MONGO_URI', 'JWT_SECRET', 'UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'];
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const config = {
  port: process.env.PORT || 4000,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGO_URI,
  upstashRedisRestUrl: process.env.UPSTASH_REDIS_REST_URL,
  upstashRedisRestToken: process.env.UPSTASH_REDIS_REST_TOKEN,
  jwtSecret: process.env.JWT_SECRET,
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM,
  },
  adminNotificationEmail: process.env.ADMIN_NOTIFICATION_EMAIL,
};

let cached = global.__mongoConnection;
if (!cached) {
  cached = global.__mongoConnection = { conn: null, promise: null };
}

export const dbConnection = async () => {
  if (cached.conn) return cached.conn;
  if (mongoose.connection.readyState === 1) {
    cached.conn = mongoose.connection;
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(config.mongoUri, { dbName: 'ZAAN' })
      .then((m) => {
        console.log('Connected to database successfully');
        return m.connection;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default config;
