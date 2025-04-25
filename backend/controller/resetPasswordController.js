import bcrypt from 'bcryptjs';
import redisClient from '../utils/redisClient.js';
import Profile from '../models/Profiles.js';

export const handleResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) return res.status(400).json({ message: 'All fields are required' });

  const savedOtp = await redisClient.get(`reset:${email}`);
  if (!savedOtp || savedOtp !== otp) return res.status(400).json({ message: 'Invalid or expired OTP' });

  const password_hash = await bcrypt.hash(newPassword, 10);
  await Profile.findOneAndUpdate({ email }, { password_hash });

  await redisClient.del(`reset:${email}`);
  return res.status(200).json({ message: 'Password reset successful' });
};
