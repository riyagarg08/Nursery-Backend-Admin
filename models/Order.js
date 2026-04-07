import mongoose, { Schema } from "mongoose";

const OrderItemSchema = new Schema({
  itemType: { type: String, enum: ['product','service'] },
  itemId: { type: Schema.Types.ObjectId },
  product_id:  { type: Schema.Types.ObjectId, ref: "Product" }, // Legacy compatibility
  name:        { type: String, required: true },
  qty:         { type: Number },
  quantity: { type: Number, default: 1 },
  unit_price:  { type: Number },
  unitPrice: { type: Number },
  subtotal:    { type: Number },
  totalPrice: { type: Number }
}, { _id: false });

const OrderServiceSchema = new Schema({
  service_id:      { type: Schema.Types.ObjectId, ref: "Service" },
  name:            { type: String, required: true },
  price:           { type: Number, required: true },
  scheduled_date:  { type: Date },
  time_slot:       { type: String },
}, { _id: false });

const StatusHistorySchema = new Schema({
  status:    { type: String, required: true },
  note:      { type: String, default: "" },
  changedAt: { type: Date }, // from vendor schema
  timestamp: { type: Date, default: Date.now },
}, { _id: false });

// Merged complete order schema
const OrderSchema = new Schema({
  orderId: String,  
  user_id:     { type: Schema.Types.ObjectId, ref: "User", index: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'User' },
  nursery_id:  { type: Schema.Types.ObjectId, ref: "Nursery" },
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor' },

  items:    { type: [OrderItemSchema], default: [] },
  services: { type: [OrderServiceSchema], default: [] },

  delivery_address: { 
    line1: { type: String }, 
    city: { type: String }, 
    state: { type: String }, 
    pincode: { type: String } 
  },
  deliveryAddress: {
    line1: String, city: String, state: String, pincode: String
  },
  
  delivery_method:  { type: String },
  deliveryMethod: { type: String, enum: ['self_delivery','pickup','platform_delivery'] },

  coupon_code:      { type: String, default: null },
  discount_amount:  { type: Number, default: 0 },
  subtotal:         { type: Number },
  delivery_charge:  { type: Number, default: 0 },
  total_amount:     { type: Number },

  pricing: {
    subtotal: Number,
    deliveryCharge: Number,
    discount: Number,
    cashback: Number,
    total: Number
  },

  payment: {
    method:              { type: String, default: "razorpay" },
    razorpay_order_id:   { type: String, default: null },
    razorpay_payment_id: { type: String, default: null },
    razorpay_signature:  { type: String, default: null },
    status: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
  },
  
  paymentMethod: { type: String, enum: ['cod','upi','card','wallet','netbanking'] },
  paymentStatus: { type: String, enum: ['pending','paid','refunded','failed'], default: 'pending' },
  paymentTransactionId: String,

  status: { type: String, default: "placed" },
  
  cancellationReason: String,
  cancelledBy: { type: String, enum: ['customer','vendor','admin'] },

  status_history: { type: [StatusHistorySchema], default: [] },
  statusTimeline: { type: [StatusHistorySchema], default: [] },
  
  scheduledAt: Date,

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
