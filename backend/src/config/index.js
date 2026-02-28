import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '..', 'config', 'config.env') });

const required = ['MONGO_URI', 'JWT_SECRET', 'REDIS_URL'];
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const config = {
  port: process.env.PORT || 4000,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGO_URI,
  redisUrl: process.env.REDIS_URL,
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

export const dbConnection = () => {
  mongoose.connect(config.mongoUri, { dbName: 'ZAAN' })
    .then(() => console.log('Connected to database successfully'))
    .catch((err) => console.log('Error connecting to database:', err));
};

export default config;
