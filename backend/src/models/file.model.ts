import mongoose, { Schema, Document } from "mongoose";

export interface IFile extends Document {
  name: string;
  url: string;
  orgId: mongoose.Types.ObjectId;
  uploadedBy: mongoose.Types.ObjectId;
}

const fileSchema = new Schema<IFile>(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    orgId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
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