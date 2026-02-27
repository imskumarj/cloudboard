import User from "../models/user.model";
import NotificationPreference from "../models/notificationPreference.model";
import Notification from "../models/notification.model";
import { sendEmail } from "./email.util";
import { getIO } from "../socket";

export const notifyTaskAssigned = async (
  assigneeId: string,
  orgId: string,
  task: any
) => {
  const user = await User.findById(assigneeId);
  if (!user) return;

  const prefs =
    (await NotificationPreference.findOne({ userId: assigneeId })) ||
    (await NotificationPreference.create({ userId: assigneeId }));

  // Save notification in DB
  await Notification.create({
    userId: assigneeId,
    orgId,
    type: "task_assignment",
    title: "New Task Assigned",
    message: `You have been assigned: ${task.title}`,
  });

  // 🔔 Real-time socket notification (only to that user)
  const io = getIO();
  io.to(assigneeId.toString()).emit("notification", {
    type: "task_assignment",
    title: "New Task Assigned",
    message: `You have been assigned: ${task.title}`,
  });

  // 📧 Email if enabled
  if (prefs.emailNotifications && prefs.taskAssignments) {
    await sendEmail(
      user.email,
      "New Task Assigned - CloudBoard",
      `
        <h2>New Task Assigned</h2>
        <p>You have been assigned a new task:</p>
        <strong>${task.title}</strong>
        <p>${task.description || ""}</p>
      `
    );
  }
};