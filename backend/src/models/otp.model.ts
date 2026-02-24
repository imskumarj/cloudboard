import mongoose, { Schema, Document } from "mongoose";

export interface IOTP extends Document {
  email: string;
  code: string;
  type: "signup" | "reset";
  expiresAt: Date;
}

const otpSchema = new Schema<IOTP>({
  email: { type: String, required: true },
  code: { type: String, required: true },
  type: { type: String, enum: ["signup", "reset"], required: true },
  expiresAt: { type: Date, required: true },
});

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IOTP>("OTP", otpSchema);