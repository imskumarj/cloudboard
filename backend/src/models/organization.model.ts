import mongoose, { Schema, Document } from "mongoose";

export interface IOrganization extends Document {
  name: string;
  logo?: string;
  plan: string;
  inviteCode: string;
}

const organizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true },
    logo: { type: String },
    plan: { type: String, default: "free" },
    inviteCode: { type: String, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model<IOrganization>(
  "Organization",
  organizationSchema
);