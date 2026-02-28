import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateOTP, sendOTPEmail } from '../services/otpService.js';
import redisClient from '../services/redisClient.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role, student_status: user.student_status },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        student_status: user.student_status
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
};

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, role } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "First name, last name, email, and password are required." });
    }

    const name = `${firstName} ${lastName}`;

    const existingProfile = await User.findOne({ email });
    if (existingProfile) {
      return res.status(400).json({ message: "Email already exists." });
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
    await redisClient.set(redisKey, JSON.stringify(signupData), { EX: 5 * 60 });

    await sendOTPEmail(email, otp);

    return res.status(200).json({ message: "OTP sent to your email. Please verify to complete signup." });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during signup." });
  }
};

export const verifyOtp = async (req, res) => {
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
    return res.status(201).json({ message: "User created successfully.", profile });
  } catch (error) {
    console.error("Error creating user after OTP verification:", error);
    return res.status(500).json({ message: "Server error while creating user." });
  }
};

export const getProfile = async (req, res) => {
  try {
    const profile = await User.findById(req.user.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(200).json(profile);
  } catch (error) {
    console.error("Error retrieving profile:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
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

    await User.findOneAndUpdate(
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
