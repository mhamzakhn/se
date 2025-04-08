// routes/profile.js
import express from 'express';
import jwt from 'jsonwebtoken';
import Profile from '../models/Profiles.js'; // Using your Profiles model

const router = express.Router();

router.get('/', async (req, res) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' part

  try {
    // Verify the token (make sure you have set JWT_SECRET in your environment)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Retrieve the user profile using the id stored in the token payload
    const profile = await Profile.findById(decoded.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(200).json(profile);
  } catch (error) {
    console.error("Error retrieving profile:", error);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
});

export default router;
