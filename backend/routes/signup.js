// routes/Signup.js
import express from "express";
import signupController from "../controller/Signup.js";  

const router = express.Router();

/**
 * POST /api/v1/signup
 * Handle user signup process, including OTP generation and email sending
 */
router.post("/", signupController);

export default router;
