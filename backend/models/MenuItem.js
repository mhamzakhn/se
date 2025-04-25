import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema(
  {
    item_id: {
      type: Number,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    price: {
      type: Number,
      required: true
    },
    discounted_price_for_LUMS_student: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      required: true
    },
    available: {
      type: Boolean,
      default: true
    },
    imageUrl: {
      type: String,
      required: true
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

export default mongoose.model('MenuItem', MenuItemSchema);
