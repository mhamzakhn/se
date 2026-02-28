import express from 'express';
import { forgotPassword } from '../controller/authController.js';
const router = express.Router();

router.post('/', forgotPassword);

export default router;