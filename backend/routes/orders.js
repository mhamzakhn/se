// routes/order.js
import express from 'express';
import requireAuth from '../middleware/requireAuth.js';
import Order from '../models/Orders.js';
import Cart from '../models/Cart.js';

const router = express.Router();

// POST /api/v1/orders/place
// This route takes the user's current cart items, creates a new Order, and empties the cart.
router.post('/place', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id; // user id from JWT
    
    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty, cannot place an order.' });
    }

    // Calculate totalAmount (if not already computed in cart)
    // If you need to handle student discount logic, apply it here or rely on the final "price" stored in each item.
    let totalAmount = 0;
    cart.items.forEach(item => {
      totalAmount += (item.price * item.quantity);
      // or item.discounted_price_for_LUMS_student if you store the discounted price in 'price'
    });

    // Create a new Order
    const newOrder = new Order({
      user: userId,
      items: cart.items,    // copy all cart items
      totalAmount: totalAmount,
      // status defaults to "pending" per schema
    });

    await newOrder.save();

    cart.items = [];
    await cart.save();

    return res.status(200).json({
      message: 'Order placed successfully',
      order: newOrder
    });
  } catch (error) {
    console.error('Error placing order:', error);
    return res.status(500).json({ message: 'Error placing order' });
  }
});

export default router;
