import express from 'express';
import requireAuth from '../middleware/requireAuth.js';
import { placeOrder } from '../controllers/orderController.js';

const router = express.Router();

router.post('/place', requireAuth, placeOrder);

export default router;
