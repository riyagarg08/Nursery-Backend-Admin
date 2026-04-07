import mongoose, { Schema } from "mongoose";

const VendorSchema = new Schema({
  phone: { type: String, required: true, unique: true },  
  phoneVerified: { type: Boolean, default: false },
  otp: {
    code: String,            
    expiresAt: Date,
    attempts: Number,        
    lastSentAt: Date
  },
  businessName: { type: String, required: true },
  ownerName: { type: String, required: true },
  businessType: { type: String, enum: ['nursery','garden_service','both'] },
  yearsOfExperience: Number,
  businessDescription: String,
  email: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number],   
  },
  address: {
    line1: String,
    city: String,
    state: String,
    pincode: String,
    landmark: String
  },
  offeringCategories: [{ type: String, enum: ['seeds','plants','tools','services','organic'] }],
  photos: [{ url: String, thumbnailUrl: String, isCover: Boolean }],
  bankDetails: {
    accountHolderName: String,
    accountNumberEncrypted: String,  
    accountNumberLast4: String,
    ifscCode: String,
    bankName: String,
    branchName: String,
    accountType: { type: String, enum: ['savings','current'], default: 'savings' },
    upiId: String
  },
  serviceArea: {
    radiusKm: Number,
    deliveryMethods: [{ type: String, enum: ['self_delivery','pickup','platform_delivery'] }],
    minOrderValue: Number,
    deliveryCharge: Number
  },
  workingHours: [{
    day: { type: String, enum: ['mon','tue','wed','thu','fri','sat','sun'] },
    isOpen: Boolean,
    openTime: String,   
    closeTime: String   
  }],
  status: { type: String, enum: ['pending','under_review','approved','rejected','suspended'], default: 'pending' },
  adminNote: String,           
  approvedAt: Date,
  rejectedAt: Date,
  stats: {
    totalSales: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    completedOrders: { type: Number, default: 0 },
    cancelledOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    availableBalance: { type: Number, default: 0 }
  },
  onboardingStep: { type: Number, default: 1 },  
}, { timestamps: true });

export default mongoose.models.Vendor || mongoose.model("Vendor", VendorSchema);
