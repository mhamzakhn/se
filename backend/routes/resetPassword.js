import express from 'express';
import { resetPassword } from '../controller/authController.js';
const router = express.Router();

router.post('/', resetPassword);

export default router;
