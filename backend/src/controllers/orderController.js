import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import { sendResponse } from '../utils/response.js';

export const placeOrder = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { instructions = '' } = req.body;

  const cart = await Cart.findOne({ user: userId });
  if (!cart || cart.items.length === 0) {
    throw new AppError('Cart is empty, cannot place an order.', 400);
  }

  const userProfile = await User.findById(userId);
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

  sendResponse(res, 200, { order: newOrder }, 'Order placed successfully');
});
