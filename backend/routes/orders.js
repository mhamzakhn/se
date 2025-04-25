// routes/order.js
import express from 'express';
import requireAuth from '../middleware/requireAuth.js';
import Order from '../models/Orders.js';
import Cart from '../models/Cart.js';
import Profile from '../models/Profiles.js';

const router = express.Router();

/**
 * POST /api/v1/orders/place
 * This route takes the user's current cart items, creates a new Order, and empties the cart.
 * Requires authentication.
 */
router.post('/place', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { instructions = "" } = req.body;
    
    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty, cannot place an order.' });
    }

    const userProfile = await Profile.findById(userId);
    const isStudent = userProfile?.student_status === 'student';

    const orderItems = cart.items.map(item => {
      const finalPrice = isStudent ? item.discounted_price_for_LUMS_student : item.price;
      return {
        item_id: item.item_id,
        name: item.name,
        quantity: item.quantity,
        price: finalPrice,
        discounted_price_for_LUMS_student: item.discounted_price_for_LUMS_student,
      };
    });

    const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newOrder = new Order({
      user: userId,
      items: orderItems,
      totalAmount: totalAmount,
      instructions: instructions,
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
