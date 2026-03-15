import express from 'express';
import requireAuth from '../middleware/requireAuth.js';
import { placeOrder, getMyOrders } from '../controllers/orderController.js';

const router = express.Router();

router.get('/', requireAuth, getMyOrders);
router.post('/place', requireAuth, placeOrder);

export default router;
