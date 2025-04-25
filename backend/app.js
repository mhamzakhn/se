// backend/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dbConnection } from "./database/dbConnection.js";

import signupRouter from "./routes/signup.js";
import verifyOtpRouter from "./routes/verifyOTP.js";
import loginRouter from "./routes/login.js";
import menuRoutes from "./routes/menu.js";
import adminMenuRoutes from "./routes/adminMenu.js";
import adminEmailRoutes from "./routes/adminEmail.js";
import profileRoutes from "./routes/profile.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/orders.js";

dotenv.config({ path: "./config/config.env" });

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public / auth routes
app.use("/api/v1/signup", signupRouter);
app.use("/api/v1/verify-otp", verifyOtpRouter);
app.use("/api/v1/login", loginRouter);

// Menu routes
app.use("/api/v1/menu", menuRoutes);

// Admin‐only routes
app.use("/api/v1/admin/menu", adminMenuRoutes);
app.use("/api/v1/admin", adminEmailRoutes);

// User‐specific routes
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);

dbConnection();

export default app;
