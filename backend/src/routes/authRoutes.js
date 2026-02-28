import express from 'express';
import { login, signup, verifyOtp, getProfile, forgotPassword, resetPassword } from '../controllers/authController.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/verify-otp', verifyOtp);
router.get('/profile', requireAuth, getProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
