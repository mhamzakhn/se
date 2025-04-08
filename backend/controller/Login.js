import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Profile from '../models/Profiles.js';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    
    const user = await Profile.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email not found." });
    }
    
    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password." });
    }
    
    // Sign a JWT with minimal user data; adjust the payload as necessary
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role, student_status: user.student_status },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    // Debug print: log the generated token (Remove or mask this in production)
    console.log("Generated JWT token:", token);
    
    // Send back the token in the response body
    res.status(200).json({ message: "Login successful", token, user: {id: user._id, name: user.name, email: user.email, role: user.role, student_status: user.student_status} });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
};

export default login;
