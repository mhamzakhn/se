// routes/profile.js
import express from 'express';
import jwt from 'jsonwebtoken';
import Profile from '../models/Profiles.js';
import requireAuth from '../middleware/requireAuth.js'; 

const router = express.Router();

/**
 * GET /api/v1/profile
 * Retrieve the authenticated user's profile based on the JWT token
 * The token is sent in the Authorization header as a Bearer token.
 */
router.get('/', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' part to get the token

  try {
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
