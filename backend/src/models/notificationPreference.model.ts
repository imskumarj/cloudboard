import mongoose, { Schema, Document } from "mongoose";

export interface INotificationPreference extends Document {
  userId: mongoose.Types.ObjectId;
  emailNotifications: boolean;
  pushNotifications: boolean;
  taskAssignments: boolean;
  mentions: boolean;
}

const schema = new Schema<INotificationPreference>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", unique: true },
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    taskAssignments: { type: Boolean, default: true },
    mentions: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<INotificationPreference>(
  "NotificationPreference",
  schema
);