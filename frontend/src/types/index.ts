export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "admin" | "manager" | "member";
  orgId: string;
}

export interface Organization {
  id: string;
  name: string;
  logo?: string;
  plan: "free" | "pro" | "enterprise";
  memberCount: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "completed" | "on-hold";
  progress: number;
  orgId: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "in-review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  assigneeId: string;
  projectId: string;
  tags: string[];
  dueDate: string;
  createdAt: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  projectId: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface ActivityItem {
  id: string;
  userId: string;
  action: string;
  target: string;
  timestamp: string;
}
