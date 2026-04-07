import mongoose, { Schema } from "mongoose";

const TransactionSchema = new Schema({
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order' }, // optional for payout
  type: { type: String, enum: ['order_earning','cashback','refund_deduction','wallet_used','payout','platform_fee','adjustment'] },
  amount: Number,               
  balanceAfter: Number,         
  description: String,          
  status: { type: String, enum: ['pending','completed','failed'], default: 'completed' },
  payoutDetails: {              
    bankAccountLast4: String,
    ifscCode: String,
    utrNumber: String,          
    settledAt: Date
  },
}, { timestamps: true });

export default mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);
