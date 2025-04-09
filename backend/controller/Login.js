import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Profile from '../models/Profiles.js';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if both email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    
    // Check if the user exists in the database
    const user = await Profile.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email not found." });
    }
    
    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password." });
    }
    
    // Create a JWT token with user data
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role, student_status: user.student_status },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    // Respond with a success message and the token
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

export default login;
