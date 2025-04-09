// routes/login.js
import express from 'express';
import loginController from '../controller/Login.js';

const router = express.Router();

/**
 * POST /api/v1/login
 * Handle user login.
 * Accepts email and password, returns a JWT token if successful.
 */
router.post('/', loginController);

export default router;
