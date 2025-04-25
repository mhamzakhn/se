import express from 'express';
import { handleResetPassword } from '../controller/resetPasswordController.js';
const router = express.Router();

router.post('/', handleResetPassword);

export default router;
