import Profile from '../models/Profiles.js';
import { generateOTP, sendOTPEmail } from '../utils/otp.js';
import redisClient from '../utils/redisClient.js';

export const handleForgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const user = await Profile.findOne({ email });
  if (!user) return res.status(404).json({ message: 'No account found with that email' });

  const otp = generateOTP();
  await redisClient.set(`reset:${email}`, otp, { EX: 5 * 60 }); // 5 minutes expiry
  await sendOTPEmail(email, otp);

  return res.status(200).json({ message: 'OTP sent to your email' });
};
