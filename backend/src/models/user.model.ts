import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  orgId: mongoose.Types.ObjectId;
  role: "admin" | "manager" | "member";
  approved: boolean;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    orgId: { type: Schema.Types.ObjectId, ref: "Organization" },
    role: {
      type: String,
      enum: ["admin", "manager", "member"],
      default: "member",
    },
    approved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);