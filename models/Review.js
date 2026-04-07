import mongoose, { Schema } from "mongoose";

const ReviewSchema = new Schema({
  user_id:     { type: Schema.Types.ObjectId, ref: "User" },
  customerId: { type: Schema.Types.ObjectId, ref: 'User' },
  nursery_id:  { type: Schema.Types.ObjectId, ref: "Nursery" },
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor' },
  order_id:    { type: Schema.Types.ObjectId, ref: "Order" },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
  rating:      { type: Number, required: true, min: 1, max: 5 },
  comment:     { type: String, default: "" },
  images:      [{ type: String }],
  vendorReply: {
    text: String,
    repliedAt: Date
  },
  isVerifiedPurchase: { type: Boolean, default: true },
}, { timestamps: { createdAt: "created_at", updatedAt: "updatedAt" } });

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);
