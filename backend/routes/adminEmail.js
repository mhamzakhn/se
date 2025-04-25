// backend/routes/adminEmail.js
import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import requireAdmin from "../middleware/requireAdmin.js";
import { sendAdminEmail } from "../controller/adminController.js";

const router = express.Router();

// POST /api/v1/admin/send-email
router.post(
  "/send-email",
  requireAuth,
  requireAdmin,
  sendAdminEmail
);

export default router;
