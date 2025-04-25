import express from 'express';
import bcrypt from 'bcryptjs';
import Profile from '../models/Profiles.js';
import redisClient from '../utils/redisClient.js';


const router = express.Router();


router.post('/', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required." });
  }

  const redisKey = `signup:${email}`;
  const data = await redisClient.get(redisKey);
  if (!data) {
    return res.status(400).json({ message: "OTP expired or not found. Please try signing up again." });
  }

  const signupData = JSON.parse(data);

  if (signupData.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP. Please try again." });
  }

  try {
    const profile = new Profile({
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
    return res.status(201).json({ message: "User created successfully.", profile });
  } catch (error) {
    console.error("Error creating user after OTP verification:", error);
    return res.status(500).json({ message: "Server error while creating user." });
  }
});

export default router;
