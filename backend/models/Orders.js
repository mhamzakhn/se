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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',  // reference to your Profile model
    required: true,
  },
  items: [OrderItemSchema],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true // createdAt and updatedAt
});

export default mongoose.model('Order', OrderSchema);
