import Cart from '../models/Cart.js';

export const addToCart = async (req, res) => {
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
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(200).json({ items: [] });
    }
    return res.status(200).json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return res.status(500).json({ message: 'Error fetching cart' });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { quantity } = req.body;
    const { itemId } = req.params;

    if (quantity < 1) {
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
};

export const deleteCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;

    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { items: { item_id: itemId } } },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    return res.status(200).json({ cart });
  } catch (err) {
    console.error("Delete cart item error:", err);
    return res.status(500).json({ message: "Error deleting item from cart" });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $set: { items: [] } },
      { new: true }
    );
    res.status(200).json(cart);
  } catch (err) {
    console.error("Error clearing cart:", err);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};
