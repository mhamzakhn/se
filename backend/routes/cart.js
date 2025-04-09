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

// Add the PUT endpoint here to update the quantity of a cart item
router.put('/item/:itemId', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { quantity } = req.body;
    const { itemId } = req.params;

    if (quantity < 1) {
      // Optionally, remove the item if quantity is less than 1.
      await Cart.findOneAndUpdate(
        { user: userId },
        { $pull: { items: { item_id: itemId } } }
      );
      return res.status(200).json({ message: 'Item removed from cart' });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the item in the cart and update its quantity
    const itemIndex = cart.items.findIndex(
      (item) => item.item_id.toString() === itemId
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    return res.status(200).json({ message: 'Cart updated', cart });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return res.status(500).json({ message: 'Error updating cart item' });
  }
});

export default router;
