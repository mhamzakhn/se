import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { dbConnection } from "./database/dbConnection.js";
import signupRouter from "./routes/signup.js";
import verifyOtpRouter from "./routes/verifyOTP.js";
import loginRouter from "./routes/login.js";
import menuRoutes from "./routes/menu.js";
import profileRoutes from "./routes/profile.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/orders.js";
import adminMenuRoutes from "./routes/adminMenu.js";
import adminOrdersRouter from "./routes/adminOrders.js";
import adminEmailRoutes from "./routes/adminEmail.js";

import forgotPasswordRouter from './routes/forgotPassword.js';
import resetPasswordRouter from './routes/resetPassword.js';

dotenv.config({ path: "./config/config.env" });

const app = express();

app.use(
  "/images",
  express.static(path.join(__dirname, "images"))
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/signup", signupRouter);
app.use("/api/v1/verify-otp", verifyOtpRouter);
app.use("/api/v1/login", loginRouter);

app.use('/api/v1/forgot-password', forgotPasswordRouter);
app.use('/api/v1/reset-password', resetPasswordRouter);

app.use('/api/v1/menu', menuRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/admin/orders', adminOrdersRouter);
app.use("/api/v1/admin/menu", adminMenuRoutes);
app.use("/api/v1/admin", adminEmailRoutes);

dbConnection();


export default app;
