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
      type: String // 'text' in DB, but String in Mongoose
    },
    price: {
      type: Number, // or mongoose.Schema.Types.Decimal128 if you need high precision
      required: true
    },
    discounted_price_for_LUMS_student: {
      type: Number, // or mongoose.Schema.Types.Decimal128
      default: 0
    },
    category: {
      type: String,
      required: true
    },
    available: {
      type: Boolean,
      default: true
    }
  },
  {
    // This option automatically creates 'created_at' and 'updated_at' fields
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

export default mongoose.model('MenuItem', MenuItemSchema);
