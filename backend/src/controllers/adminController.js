import { sendMail } from '../services/emailService.js';
import User from '../models/User.js';
import MenuItem from '../models/MenuItem.js';
import Order from '../models/Order.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

export const sendAdminEmail = catchAsync(async (req, res) => {
  const { subject, content } = req.body;

  const profiles = await User.find({}, 'email').lean();
  const emails = profiles.map((p) => p.email);

  if (emails.length === 0) {
    throw new AppError('No users found to send email to.', 404);
  }

  await sendMail({
    to: process.env.SMTP_FROM,
    bcc: emails,
    subject,
    text: content,
    html: `<p>${content.replace(/\n/g, '<br>')}</p>`,
  });

  res.status(200).json({ message: 'Emails sent successfully.' });
});

export const addMenuItem = catchAsync(async (req, res) => {
  const newItem = new MenuItem(req.body);
  await newItem.save();
  res.status(201).json(newItem);
});

export const updateMenuItem = catchAsync(async (req, res) => {
  const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedItem) {
    throw new AppError('Item not found', 404);
  }
  res.status(200).json(updatedItem);
});

export const deleteMenuItem = catchAsync(async (req, res) => {
  const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
  if (!deletedItem) {
    throw new AppError('Item not found', 404);
  }
  res.status(200).json({ message: 'Item deleted successfully' });
});

export const getPendingOrders = catchAsync(async (req, res) => {
  const orders = await Order.find({ status: 'pending' })
    .sort({ createdAt: -1 })
    .populate('user', 'name email phone');

  res.json(orders);
});

export const updateOrderStatus = catchAsync(async (req, res) => {
  const { status } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status, updatedAt: new Date() },
    { new: true }
  );

  if (!order) {
    throw new AppError('Order not found', 404);
  }
  res.json(order);
});
