// routes/order.js
import express from 'express';
import requireAuth from '../middleware/requireAuth.js';
import Order from '../models/Orders.js';

const router = express.Router();

// POST /api/v1/orders: Place a new order (protected route)
router.post('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { items } = req.body; // Expecting an array of items from the frontend

    if (!items || !items.length) {
      return res.status(400).json({ message: 'Order items are required.' });
    }

    // Calculate total amount
    const totalAmount = items.reduce((total, item) => {
      return total + (item.discounted_price_for_LUMS_student * (item.quantity || 1));
    }, 0);

    // Create a new order document
    const newOrder = new Order({
      user: userId,
      items,
      totalAmount,
      status: 'pending'
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Error placing order' });
  }
});

// GET /api/v1/orders: Retrieve orders for the authenticated user (protected route)
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

export default router;
