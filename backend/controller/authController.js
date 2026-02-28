import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Profile from '../models/Profiles.js';
import { generateOTP, sendOTPEmail } from '../utils/otp.js';
import redisClient from '../utils/redisClient.js';


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await Profile.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    const otp = generateOTP();
    const redisKey = `reset:${email}`;
    
    await redisClient.set(redisKey, JSON.stringify({
      otp,
      createdAt: Date.now()
    }), { EX: 600 });

    await sendOTPEmail(email, otp);
    
    return res.status(200).json({ 
      message: "OTP sent to your email", 
      email 
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const redisKey = `reset:${email}`;
    const storedData = await redisClient.get(redisKey);
    
    if (!storedData) {
      return res.status(400).json({ message: "OTP expired or invalid" });
    }

    const { otp: storedOTP } = JSON.parse(storedData);
    
    if (otp !== storedOTP) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await redisClient.set(redisKey, JSON.stringify({
      ...JSON.parse(storedData),
      verified: true
    }));

    return res.status(200).json({ 
      message: "OTP verified successfully" 
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, otp } = req.body;
    
    if (!email || !newPassword || !otp) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const redisKey = `reset:${email}`;
    const storedData = await redisClient.get(redisKey);
    
    if (!storedData) {
      return res.status(400).json({ message: "Session expired. Please request a new OTP." });
    }

    const { otp: storedOTP, verified } = JSON.parse(storedData);
    
    if (otp !== storedOTP || !verified) {
      return res.status(400).json({ message: "Invalid OTP or OTP not verified" });
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(newPassword, saltRounds);
    
    await Profile.findOneAndUpdate(
      { email },
      { password_hash },
      { new: true }
    );

    await redisClient.del(redisKey);
    
    return res.status(200).json({ 
      message: "Password reset successfully" 
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};