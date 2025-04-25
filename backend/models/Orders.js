// models/Order.js
import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  item_id: { type: Number, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  discounted_price_for_LUMS_student: { type: Number, required: true },
  quantity: { type: Number, default: 1 }
});

const OrderSchema = new mongoose.Schema({
  user: {
    type: String,
    ref: 'Profile', 
    required: true,
  },
  items: [OrderItemSchema],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
    default: 'pending'
  },
  instructions: { 
    type: String, 
    default: "",
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true
});

export default mongoose.model('Order', OrderSchema);
