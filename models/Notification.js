import mongoose, { Schema } from "mongoose";

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
