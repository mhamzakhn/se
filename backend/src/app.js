import express from "express";
import cors from "cors";

import config, { dbConnection } from "./config/index.js";
import authRoutes from "./routes/authRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { errorMiddleware } from "./middleware/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: config.frontendUrl,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure DB is connected before handling requests
app.use(async (req, res, next) => {
  await dbConnection();
  next();
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/menu", menuRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/admin", adminRoutes);

app.use(errorMiddleware);

export default app;
