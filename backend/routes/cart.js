// routes/cart.js
import express from 'express';
import requireAuth from '../middleware/requireAuth.js';
import Cart from '../models/Cart.js';

const router = express.Router();

/**
 * POST /api/v1/cart/add
 * Add an item to the cart or update its quantity.
 * Requires authentication.
 */
router.post('/add', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { item_id, name, price, discounted_price_for_LUMS_student, quantity } = req.body;

    if (!item_id || !name || !price) {
      return res.status(400).json({ message: 'Item details are required.' });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      item => item.item_id === item_id
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      cart.items.push({ item_id, name, price, discounted_price_for_LUMS_student, quantity: quantity || 1 });
    }

    await cart.save();
    return res.status(200).json({ message: 'Item added to cart', cart });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return res.status(500).json({ message: 'Error adding item to cart' });
  }
});

/**
 * GET /api/v1/cart
 * Retrieve the current cart for the authenticated user.
 * Requires authentication.
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(200).json({ items: [] }); // Return empty if no cart exists
    }
    return res.status(200).json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return res.status(500).json({ message: 'Error fetching cart' });
  }
});

export default router;
