import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateOTP, sendOTPEmail } from '../services/otpService.js';
import redisClient from '../services/redisClient.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import { sendResponse } from '../utils/response.js';

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('Email not found.', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new AppError('Incorrect password.', 401);
  }

  const token = jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role, student_status: user.student_status },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  sendResponse(res, 200, {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      student_status: user.student_status,
    },
  }, 'Login successful');
});

export const signup = catchAsync(async (req, res) => {
  const { firstName, lastName, email, password, phone, role } = req.body;

  const name = `${firstName} ${lastName}`;

  const existingProfile = await User.findOne({ email });
  if (existingProfile) {
    throw new AppError('Email already exists.', 400);
  }

  let determinedStudentStatus = 'non-student';
  const lowerEmail = email.toLowerCase();
  if (lowerEmail.endsWith('@lums.edu.pk')) {
    determinedStudentStatus = 'student';
  }

  const saltRounds = 10;
  const password_hash = await bcrypt.hash(password, saltRounds);

  const otp = generateOTP();

  const signupData = {
    name,
    email,
    password_hash,
    phone,
    role: role || 'user',
    student_status: determinedStudentStatus,
    otp,
  };

  const redisKey = `signup:${email}`;
  await redisClient.set(redisKey, signupData, { ex: 5 * 60 });

  await sendOTPEmail(email, otp);

  sendResponse(res, 200, null, 'OTP sent to your email. Please verify to complete signup.');
});

export const verifyOtp = catchAsync(async (req, res) => {
  const { email, otp } = req.body;

  const redisKey = `signup:${email}`;
  const signupData = await redisClient.get(redisKey);
  if (!signupData) {
    throw new AppError('OTP expired or not found. Please try signing up again.', 400);
  }

  if (signupData.otp !== otp) {
    throw new AppError('Invalid OTP. Please try again.', 400);
  }

  const profile = new User({
    _id: email,
    email,
    name: signupData.name,
    password_hash: signupData.password_hash,
    phone: signupData.phone,
    student_status: signupData.student_status,
    role: signupData.role,
  });
  await profile.save();
  await redisClient.del(redisKey);
  sendResponse(res, 201, { profile }, 'User created successfully.');
});

export const getProfile = catchAsync(async (req, res) => {
  const profile = await User.findById(req.user.id);
  if (!profile) {
    throw new AppError('Profile not found', 404);
  }
  sendResponse(res, 200, profile);
});

export const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('Email not found', 404);
  }

  const otp = generateOTP();
  const redisKey = `reset:${email}`;

  await redisClient.set(redisKey, { otp, createdAt: Date.now() }, { ex: 600 });

  await sendOTPEmail(email, otp);

  sendResponse(res, 200, { email }, 'OTP sent to your email');
});

export const verifyResetOTP = catchAsync(async (req, res) => {
  const { email, otp } = req.body;

  const redisKey = `reset:${email}`;
  const storedData = await redisClient.get(redisKey);

  if (!storedData) {
    throw new AppError('OTP expired or invalid', 400);
  }

  if (otp !== storedData.otp) {
    throw new AppError('Invalid OTP', 400);
  }

  await redisClient.set(redisKey, { ...storedData, verified: true });

  sendResponse(res, 200, null, 'OTP verified successfully');
});

export const resetPassword = catchAsync(async (req, res) => {
  const { email, newPassword, otp } = req.body;

  const redisKey = `reset:${email}`;
  const storedData = await redisClient.get(redisKey);

  if (!storedData) {
    throw new AppError('Session expired. Please request a new OTP.', 400);
  }

  if (otp !== storedData.otp || !storedData.verified) {
    throw new AppError('Invalid OTP or OTP not verified', 400);
  }

  const saltRounds = 10;
  const password_hash = await bcrypt.hash(newPassword, saltRounds);

  await User.findOneAndUpdate(
    { email },
    { password_hash },
    { new: true }
  );

  await redisClient.del(redisKey);

  sendResponse(res, 200, null, 'Password reset successfully');
});
