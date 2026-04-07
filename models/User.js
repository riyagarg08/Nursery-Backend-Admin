import mongoose, { Schema } from "mongoose";

const AddressSchema = new Schema(
  {
    line1:   { type: String, required: true },
    city:    { type: String, required: true },
    state:   { type: String, required: true },
    pincode: { type: String, required: true },
    lat:     { type: Number },
    lng:     { type: Number },
  },
  { _id: false }
);

const UserSchema = new Schema(
  {
    phone_number: { type: String, required: true, unique: true, index: true },
    name:         { type: String, default: null },
    email:        { type: String, default: null },
    address:      { type: AddressSchema, default: null },
    is_verified:  { type: Boolean, default: false },
    is_active:    { type: Boolean, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
