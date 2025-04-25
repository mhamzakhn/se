// routes/order.js
import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import Order from "../models/Orders.js";
import Cart from "../models/Cart.js";

const router = express.Router();

router.post("/place", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart || cart.items.length === 0) {
      return res
        .status(400)
        .json({ message: "Cart is empty, cannot place an order." });
    }

    let totalAmount = 0;
    cart.items.forEach((item) => {
      totalAmount += item.price * item.quantity;
    });

    const newOrder = new Order({
      user: userId,
      items: cart.items,
      totalAmount: totalAmount,
    });

    await newOrder.save();

    cart.items = [];
    await cart.save();

    return res.status(200).json({
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({ message: "Error placing order" });
  }
});

router.get("/recent", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const recentOrder = await Order.findOne({ user: userId })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!recentOrder) {
      return res.status(404).json({ message: "No recent orders found." });
    }

    return res.status(200).json({
      order: recentOrder,
    });
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    return res.status(500).json({ message: "Error fetching recent order." });
  }
});

export default router;
