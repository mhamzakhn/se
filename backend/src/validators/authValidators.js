import { body } from 'express-validator';

export const validateSignup = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

export const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const validateVerifyOtp = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('otp').notEmpty().withMessage('OTP is required'),
];

export const validateForgotPassword = [
  body('email').isEmail().withMessage('Valid email is required'),
];

export const validateResetPassword = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('otp').notEmpty().withMessage('OTP is required'),
];
