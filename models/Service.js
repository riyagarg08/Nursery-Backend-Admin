import mongoose, { Schema } from "mongoose";

// Merged definition
const ServiceSchema = new Schema({
  nursery_id: { type: Schema.Types.ObjectId, ref: "Nursery", index: true },
  vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", index: true },
  name: { type: String, required: true },
  description: { type: String, default: "" },
  category: {
    type: String,
    enum: ["planting", "pruning", "landscaping", "consultation", "repotting", "pest_control", "soil_change", "garden_setup","maintenance","plant_doctor", "other"],
    required: true,
  },
  serviceType: { type: String }, // mapping to vendor part
  price: { type: Number, required: true, min: 0 },
  priceOnwards: { type: Number },
  duration_minutes: { type: Number, default: 60 },
  durationMinutes: { type: Number },
  available_days: [{ type: String, enum: ["mon","tue","wed","thu","fri","sat","sun", "Mon","Tue","Wed","Thu","Fri","Sat","Sun"] }],
  slot_times: [{ type: String }],
  images: [{ url: String, thumbnailUrl: String }],
  is_available: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  totalBooked: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

export default mongoose.models.Service || mongoose.model("Service", ServiceSchema);
