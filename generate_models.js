const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'models');
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir);
}

const libDir = path.join(__dirname, 'lib');
if (!fs.existsSync(libDir)) {
  fs.mkdirSync(libDir);
}

// ======================= DB Config =======================

const dbContent = `import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  
  return cached.conn;
}

export default dbConnect;
`;
fs.writeFileSync(path.join(libDir, 'mongodb.js'), dbContent);

// ======================= Models =======================

const models = {
  'User.js': `import mongoose, { Schema } from "mongoose";

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
`,

  'OtpSession.js': `import mongoose, { Schema } from "mongoose";

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
`,

  'Nursery.js': `import mongoose, { Schema } from "mongoose";

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
`,

  'Vendor.js': `import mongoose, { Schema } from "mongoose";

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
`,

  'VendorKyc.js': `import mongoose, { Schema } from "mongoose";

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
`,

  'Product.js': `import mongoose, { Schema } from "mongoose";

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
`,

  'Service.js': `import mongoose, { Schema } from "mongoose";

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
`,

  'Cart.js': `import mongoose, { Schema } from "mongoose";

const CartItemSchema = new Schema({
  product_id:  { type: Schema.Types.ObjectId, ref: "Product", required: true },
  name:        { type: String, required: true },       
  qty:         { type: Number, required: true, min: 1 },
  unit_price:  { type: Number, required: true },
  subtotal:    { type: Number, required: true },
}, { _id: false });

const CartServiceSchema = new Schema({
  service_id:      { type: Schema.Types.ObjectId, ref: "Service", required: true },
  name:            { type: String, required: true },   
  price:           { type: Number, required: true },
  scheduled_date:  { type: Date, default: null },
  time_slot:       { type: String, default: null },    
}, { _id: false });

const CartSchema = new Schema({
  user_id:         { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  nursery_id:      { type: Schema.Types.ObjectId, ref: "Nursery", default: null }, 
  items:           { type: [CartItemSchema], default: [] },
  services:        { type: [CartServiceSchema], default: [] },
  coupon_code:     { type: String, default: null },
  discount_amount: { type: Number, default: 0 },
  total_amount:    { type: Number, default: 0 },
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
`,

  'Coupon.js': `import mongoose, { Schema } from "mongoose";

const CouponSchema = new Schema({
  code:              { type: String, required: true, unique: true, uppercase: true },
  discount_type:     { type: String, enum: ["flat", "percent"], required: true },
  discount_value:    { type: Number, required: true, min: 0 },
  min_order_amount:  { type: Number, default: 0 },
  max_discount_cap:  { type: Number, default: null },   
  max_uses:          { type: Number, default: null },   
  used_count:        { type: Number, default: 0 },
  valid_from:        { type: Date, required: true },
  valid_until:       { type: Date, required: true },
  is_active:         { type: Boolean, default: true },
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

export default mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);
`,

  'Order.js': `import mongoose, { Schema } from "mongoose";

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
`,

  'Review.js': `import mongoose, { Schema } from "mongoose";

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
`,

  'Transaction.js': `import mongoose, { Schema } from "mongoose";

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
`,

  'Notification.js': `import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema({
  recipientId: { type: Schema.Types.ObjectId, required: true },
  recipientType: { type: String, enum: ['vendor','customer','admin'] },
  type: { type: String, enum: ['order_confirmation','out_for_delivery','nearby_nursery_alert','plant_care_reminder','fertilizer_reminder','offer_promotion','kyc_update','payout_processed','account_status'] },
  title: String,
  body: String,
  metadata: Object,             
  isRead: { type: Boolean, default: false },
  readAt: Date,
}, { timestamps: true });

NotificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // TTL 90 days

export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
`
};

for (const [filename, content] of Object.entries(models)) {
  fs.writeFileSync(path.join(modelsDir, filename), content);
}

console.log("MongoDB connection config and all models have been generated successfully!");
