// models/Cart.js
import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  item_id: { type: Number, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  discounted_price_for_LUMS_student: { type: Number, required: true },
  quantity: { type: Number, default: 1 }
});

const CartSchema = new mongoose.Schema({
  user: {
    type: String,  // Change from ObjectId to String
    ref: 'Profile',  // Reference remains the same
    required: true,
    unique: true    // One cart per user
  },
  items: [CartItemSchema]
}, {
  timestamps: true
});

export default mongoose.model('Cart', CartSchema);
