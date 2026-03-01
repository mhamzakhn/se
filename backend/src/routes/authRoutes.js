import express from 'express';
import { login, signup, verifyOtp, getProfile, forgotPassword, verifyResetOTP, resetPassword } from '../controllers/authController.js';
import requireAuth from '../middleware/requireAuth.js';
import validate from '../middleware/validate.js';
import {
  validateSignup,
  validateLogin,
  validateVerifyOtp,
  validateForgotPassword,
  validateResetPassword,
} from '../validators/authValidators.js';

const router = express.Router();

router.post('/login', validateLogin, validate, login);
router.post('/signup', validateSignup, validate, signup);
router.post('/verify-otp', validateVerifyOtp, validate, verifyOtp);
router.get('/profile', requireAuth, getProfile);
router.post('/forgot-password', validateForgotPassword, validate, forgotPassword);
router.post('/verify-reset-otp', validateVerifyOtp, validate, verifyResetOTP);
router.post('/reset-password', validateResetPassword, validate, resetPassword);

export default router;
