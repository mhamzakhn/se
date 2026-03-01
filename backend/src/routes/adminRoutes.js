import express from 'express';
import requireAuth from '../middleware/requireAuth.js';
import requireAdmin from '../middleware/requireAdmin.js';
import validate from '../middleware/validate.js';
import {
  sendAdminEmail,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getPendingOrders,
  updateOrderStatus,
} from '../controllers/adminController.js';
import {
  validateAddMenuItem,
  validateUpdateMenuItem,
  validateUpdateOrderStatus,
  validateSendEmail,
} from '../validators/adminValidators.js';

const router = express.Router();
router.use(requireAuth);
router.use(requireAdmin);

router.post('/menu', validateAddMenuItem, validate, addMenuItem);
router.put('/menu/:id', validateUpdateMenuItem, validate, updateMenuItem);
router.delete('/menu/:id', deleteMenuItem);

router.get('/orders/pending', getPendingOrders);
router.patch('/orders/:id', validateUpdateOrderStatus, validate, updateOrderStatus);

router.post('/send-email', validateSendEmail, validate, sendAdminEmail);

export default router;
