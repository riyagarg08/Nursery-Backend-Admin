import mongoose, { Schema } from "mongoose";

const CartItemSchema = new Schema({
  product_id:  { type: Schema.Types.ObjectId, ref: "Product", required: true },
  name:        { type: String, required: true },       
  qty:         { type: Number, required: true, min: 1 },
  unit_price:  { type: Number, required: true },
  subtotal:    { type: Number, required: true },
}, { _id: false });

const CartServiceSchema = new Schema({
  service_id:      { type: Schema.Types.ObjectId, ref: "Service", required: true },
  name:            { type: String, required: true },   
  price:           { type: Number, required: true },
  scheduled_date:  { type: Date, default: null },
  time_slot:       { type: String, default: null },    
}, { _id: false });

const CartSchema = new Schema({
  user_id:         { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  nursery_id:      { type: Schema.Types.ObjectId, ref: "Nursery", default: null }, 
  items:           { type: [CartItemSchema], default: [] },
  services:        { type: [CartServiceSchema], default: [] },
  coupon_code:     { type: String, default: null },
  discount_amount: { type: Number, default: 0 },
  total_amount:    { type: Number, default: 0 },
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
