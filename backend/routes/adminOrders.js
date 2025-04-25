// ✅ BACKEND: routes/adminOrders.js
import express from 'express';
import Order from '../models/Orders.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();
router.use(requireAuth);

// GET /api/v1/admin/orders/pending
router.get('/pending', async (req, res) => {
  try {
    const orders = await Order.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pending orders' });
  }
});

// PATCH /api/v1/admin/orders/:id
router.patch('/:id', async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error updating order status' });
  }
});

export default router;
