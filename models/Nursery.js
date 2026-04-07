import mongoose, { Schema } from "mongoose";

const NurserySchema = new Schema(
  {
    name:         { type: String, required: true },
    description:  { type: String, default: "" },
    owner_user_id:{ type: Schema.Types.ObjectId, ref: "User", required: true },

    address: {
      line1:   { type: String, required: true },
      city:    { type: String, required: true },
      state:   { type: String, required: true },
      pincode: { type: String, required: true },
    },

    location: {
      type:        { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },

    rating:          { type: Number, default: 0, min: 0, max: 5 },
    total_reviews:   { type: Number, default: 0 },
    images:          [{ type: String }],                     
    delivery_options:[{ type: String, enum: ["home_delivery", "self_pickup"] }],
    is_active:       { type: Boolean, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.models.Nursery || mongoose.model("Nursery", NurserySchema);
