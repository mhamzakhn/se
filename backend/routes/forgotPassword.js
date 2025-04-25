import express from 'express';
import { handleForgotPassword } from '../controller/forgotPasswordController.js';
const router = express.Router();

router.post('/', handleForgotPassword);

export default router;