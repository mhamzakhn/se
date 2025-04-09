// app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dbConnection } from "./database/dbConnection.js"; // Import database connection
import signupRouter from "./routes/signup.js"; // Signup route
import verifyOtpRouter from "./routes/verifyOTP.js"; // OTP verification route
import loginRouter from "./routes/login.js"; // Login route
import menuRoutes from "./routes/menu.js"; // Menu items route
import profileRoutes from './routes/profile.js'; // Profile route
import cartRoutes from "./routes/cart.js"; // Cart endpoints
import orderRoutes from "./routes/orders.js"; // Order endpoints

// Load environment variables
dotenv.config({ path: "./config/config.env" });

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["POST", "GET"],
  credentials: true,
}));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/signup', signupRouter);
app.use('/api/v1/verify-otp', verifyOtpRouter);
app.use('/api/v1/login', loginRouter);
app.use('/api/v1/menu', menuRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);

// Connect to the database
dbConnection();

export default app;
