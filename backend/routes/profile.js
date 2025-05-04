import express from 'express';
import jwt from 'jsonwebtoken';
import Profile from '../models/Profiles.js';
import requireAuth from '../middleware/requireAuth.js'; 

const router = express.Router();


router.get('/', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  const token = authHeader.substring(7); 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
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
