import mongoose, { Schema } from "mongoose";

const VendorKycSchema = new Schema({
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true, unique: true },
  aadhaar: {
    number: String,              
    numberEncrypted: String,     
    frontImageUrl: String,
    backImageUrl: String,
    status: { type: String, enum: ['pending','verified','rejected'], default: 'pending' },
    rejectionReason: String,
    verifiedAt: Date
  },
  pan: {
    number: String,             
    imageUrl: String,
    status: { type: String, enum: ['pending','verified','rejected'], default: 'pending' },
    rejectionReason: String,
    verifiedAt: Date
  },
  overallKycStatus: { type: String, enum: ['incomplete','pending','verified','rejected'], default: 'incomplete' },
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  reviewedAt: Date,
}, { timestamps: true });

export default mongoose.models.VendorKyc || mongoose.model("VendorKyc", VendorKycSchema);
