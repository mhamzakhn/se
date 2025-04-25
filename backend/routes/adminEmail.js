import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import requireAdmin from "../middleware/requireAdmin.js";
import { sendAdminEmail } from "../controller/adminController.js";

const router = express.Router();

router.post(
  "/send-email",
  requireAuth,
  requireAdmin,
  sendAdminEmail
);

export default router;
