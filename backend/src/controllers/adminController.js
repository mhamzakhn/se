import { sendMail } from '../services/emailService.js';
import User from '../models/User.js';
import MenuItem from '../models/MenuItem.js';
import Order from '../models/Order.js';

export const sendAdminEmail = async (req, res) => {
  const { subject, content } = req.body;

  if (!subject?.trim() || !content?.trim()) {
    return res.status(400).json({ message: "Subject and content are required." });
  }

  try {
    const profiles = await User.find({}, "email").lean();
    const emails = profiles.map((p) => p.email);

    if (emails.length === 0) {
      return res.status(404).json({ message: "No users found to send email to." });
    }

    await sendMail({
      to: process.env.SMTP_FROM,
      bcc: emails,
      subject,
      text: content,
      html: `<p>${content.replace(/\n/g, "<br>")}</p>`,
    });

    res.status(200).json({ message: "Emails sent successfully." });
  } catch (err) {
    console.error("sendAdminEmail error:", err);
    res.status(500).json({ message: "Failed to send emails." });
  }
};

export const addMenuItem = async (req, res) => {
  try {
    const newItem = new MenuItem(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error("Error adding menu item:", err);
    res.status(400).json({ message: 'Error adding item' });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(updatedItem);
  } catch (err) {
    console.error("Error updating menu item:", err);
    res.status(500).json({ message: 'Error updating item' });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error("Error deleting menu item:", err);
    res.status(500).json({ message: 'Error deleting item' });
  }
};

export const getPendingOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .populate('user', 'name email phone');

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pending orders' });
  }
};

export const updateOrderStatus = async (req, res) => {
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
};
