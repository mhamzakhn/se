// app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dbConnection } from "./database/dbConnection.js";
import signupRouter from "./routes/Signup.js";
import verifyOtpRouter from "./routes/verify_OTP.js";
import loginRouter from "./routes/Login.js";
import menuRoutes from "./routes/menu.js";
import cartRoutes from "./routes/Cart.js";   // Cart endpoints
import orderRoutes from "./routes/Orders.js"; // Order endpoints

dotenv.config({ path: "./config/config.env" });

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["POST", "GET"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/signup', signupRouter);
app.use('/api/v1/verify-otp', verifyOtpRouter);
app.use('/api/v1/login', loginRouter);
app.use('/api/v1/menu', menuRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes); // Mount the orders route

dbConnection();

export default app;
