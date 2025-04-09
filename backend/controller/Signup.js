// controllers/signup.js
import bcrypt from 'bcryptjs';
import Profile from '../models/Profiles.js';
import { generateOTP, sendOTPEmail } from '../utils/otp.js';
import redisClient from '../utils/redisClient.js';

const signup = async (req, res) => {
  console.log("Signup endpoint hit");
  try {
    const { firstName, lastName, email, password, phone, role } = req.body;
    if (!firstName || !lastName || !email || !password) {
      console.log("Validation failed: Missing required fields");
      return res.status(400).json({ message: "First name, last name, email, and password are required." });
    }
    
    const name = `${firstName} ${lastName}`;
    
    // Check if a profile with the email already exists
    const existingProfile = await Profile.findOne({ email });
    if (existingProfile) {
      console.log("Validation failed: Email already exists");
      return res.status(400).json({ message: "Email already exists." });
    }

    // Determine student_status based on email domain
    let determinedStudentStatus = 'non-student';
    const lowerEmail = email.toLowerCase();
    if (lowerEmail.endsWith('@lums.edu.pk') || lowerEmail.endsWith('@lums.ed.pk')) {
      determinedStudentStatus = 'student';
    }

    // Immediately hash the password for security
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    console.log("Password hashed successfully");

    // Generate a 6-digit OTP
    const otp = generateOTP();

    // Prepare the signup data object to store temporarily.
    const signupData = {
      name,
      email,
      password_hash, // already hashed
      phone,
      role: role || 'user',
      student_status: determinedStudentStatus,
      otp,
    };

    // Store the signup data in Redis with an expiration of 5 minutes.
    // We'll use a key that uniquely identifies this signup (for example: "signup:<email>")
    const redisKey = `signup:${email}`;
    await redisClient.set(redisKey, JSON.stringify(signupData), { EX: 5 * 60 });
    console.log("Signup data stored in Redis for", email);

    // Send the OTP via email
    await sendOTPEmail(email, otp);
    console.log("OTP sent to email:", email);

    // Inform the frontend that OTP is sent and further verification is required.
    return res.status(200).json({ message: "OTP sent to your email. Please verify to complete signup." });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during signup." });
  }
};

export default signup;
