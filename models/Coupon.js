import mongoose, { Schema } from "mongoose";

const CouponSchema = new Schema({
  code:              { type: String, required: true, unique: true, uppercase: true },
  discount_type:     { type: String, enum: ["flat", "percent"], required: true },
  discount_value:    { type: Number, required: true, min: 0 },
  min_order_amount:  { type: Number, default: 0 },
  max_discount_cap:  { type: Number, default: null },   
  max_uses:          { type: Number, default: null },   
  used_count:        { type: Number, default: 0 },
  valid_from:        { type: Date, required: true },
  valid_until:       { type: Date, required: true },
  is_active:         { type: Boolean, default: true },
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

export default mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);
