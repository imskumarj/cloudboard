import mongoose, { Schema, Document } from "mongoose";

export interface IActivity extends Document {
  orgId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  action: string;
  target: string;
}

const activitySchema = new Schema<IActivity>(
  {
    orgId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: { type: String, required: true },
    target: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IActivity>("Activity", activitySchema);