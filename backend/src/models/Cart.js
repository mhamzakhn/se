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
    type: String,
    ref: 'Profile',
    required: true,
    unique: true
  },
  items: [CartItemSchema]
}, {
  timestamps: true
});

export default mongoose.model('Cart', CartSchema);
