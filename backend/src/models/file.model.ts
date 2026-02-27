import mongoose, { Schema, Document } from "mongoose";

export interface IFile extends Document {
  name: string;
  key: string; // S3 key
  url: string; // Public or signed URL
  size: number;
  type: string;
  projectId?: mongoose.Types.ObjectId | null;
  orgId: mongoose.Types.ObjectId;
  uploadedBy: mongoose.Types.ObjectId;
}

const fileSchema = new Schema<IFile>(
  {
    name: { type: String, required: true },
    key: { type: String, required: true },
    url: { type: String, required: true },
    size: { type: Number, required: true },
    type: { type: String },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", default: null },
    orgId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IFile>("File", fileSchema);