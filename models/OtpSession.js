import mongoose, { Schema } from "mongoose";

const OtpSessionSchema = new Schema(
  {
    phone_number: { type: String, required: true, index: true },
    otp_code:     { type: String, required: true },        // 6-digit dummy for now
    expires_at:   { type: Date, required: true, index: { expireAfterSeconds: 0 } }, // TTL index
    is_used:      { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "created_at" } }
);

export default mongoose.models.OtpSession || mongoose.model("OtpSession", OtpSessionSchema);
