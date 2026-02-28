import express from 'express';
import requireAuth from '../middleware/requireAuth.js';
import requireAdmin from '../middleware/requireAdmin.js';
import {
  sendAdminEmail,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getPendingOrders,
  updateOrderStatus,
} from '../controllers/adminController.js';

const router = express.Router();
router.use(requireAuth);
router.use(requireAdmin);

router.post('/menu', addMenuItem);
router.put('/menu/:id', updateMenuItem);
router.delete('/menu/:id', deleteMenuItem);

router.get('/orders/pending', getPendingOrders);
router.patch('/orders/:id', updateOrderStatus);

router.post('/send-email', sendAdminEmail);

export default router;
