import Cart from '../models/Cart.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import { sendResponse } from '../utils/response.js';

export const addToCart = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { item_id, name, price, discounted_price_for_LUMS_student, quantity } = req.body;

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
  sendResponse(res, 200, { cart }, 'Item added to cart');
});

export const getCart = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    return sendResponse(res, 200, { items: [] });
  }
  sendResponse(res, 200, cart);
});

export const updateCartItem = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { quantity } = req.body;
  const { itemId } = req.params;

  if (quantity < 1) {
    await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { items: { item_id: itemId } } }
    );
    return sendResponse(res, 200, null, 'Item removed from cart');
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.item_id.toString() === itemId
  );
  if (itemIndex === -1) {
    throw new AppError('Item not found in cart', 404);
  }

  cart.items[itemIndex].quantity = quantity;
  await cart.save();

  sendResponse(res, 200, { cart }, 'Cart updated');
});

export const deleteCartItem = catchAsync(async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user.id;

  const cart = await Cart.findOneAndUpdate(
    { user: userId },
    { $pull: { items: { item_id: itemId } } },
    { new: true }
  );

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  sendResponse(res, 200, { cart });
});

export const clearCart = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const cart = await Cart.findOneAndUpdate(
    { user: userId },
    { $set: { items: [] } },
    { new: true }
  );
  sendResponse(res, 200, cart);
});
