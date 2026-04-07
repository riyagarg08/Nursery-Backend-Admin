import mongoose, { Schema } from "mongoose";

// Merged the Nursery and Vendor definitions to avoid data loss
const ProductSchema = new Schema({
  nursery_id: { type: Schema.Types.ObjectId, ref: "Nursery", index: true },
  vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", index: true },
  name: { type: String, required: true },
  description: { type: String, default: "" },
  category: {
    type: String,
    enum: ["plant", "soil", "fertilizer", "pot", "tool", "seeds", "other", "indoor_plants", "outdoor_plants", "succulents", "organic_produce"],
    required: true,
  },
  price: { type: Number, required: true, min: 0 },
  discount_price: { type: Number, default: null },
  discountedPrice: { type: Number, default: null }, // for vendor context compatibility
  stock_qty: { type: Number, default: 0, min: 0 },
  stockQuantity: { type: Number, default: 0, min: 0 }, // vendor context
  unit: { type: String }, // e.g., 'piece', 'kg', 'packet', 'litre', 'bunch'
  images_simple: [{ type: String }],
  images: [{ url: String, thumbnailUrl: String, isCover: Boolean }], // merged complex format
  tags: [String],
  is_available: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  totalSold: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

ProductSchema.index({ vendorId: 1 });
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
