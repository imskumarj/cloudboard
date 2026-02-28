import { User, Organization, Project, Task, FileItem, ActivityItem } from "@/types";

export const mockOrganizations: Organization[] = [
  { id: "org-1", name: "Acme Corp", plan: "pro", memberCount: 12 },
  { id: "org-2", name: "StartupXYZ", plan: "free", memberCount: 4 },
];

export const mockUsers: User[] = [
  { id: "u-1", name: "Alex Johnson", email: "alex@acme.com", avatar: "", role: "admin", orgId: "org-1" },
  { id: "u-2", name: "Sarah Chen", email: "sarah@acme.com", avatar: "", role: "manager", orgId: "org-1" },
  { id: "u-3", name: "Mike Peters", email: "mike@acme.com", avatar: "", role: "member", orgId: "org-1" },
  { id: "u-4", name: "Emily Davis", email: "emily@acme.com", avatar: "", role: "member", orgId: "org-1" },
  { id: "u-5", name: "James Wilson", email: "james@acme.com", avatar: "", role: "manager", orgId: "org-1" },
  { id: "u-6", name: "Priya Sharma", email: "priya@acme.com", avatar: "", role: "member", orgId: "org-1" },
];

export const mockProjects: Project[] = [
  { id: "p-1", name: "Website Redesign", description: "Complete overhaul of the company website with modern UI/UX", status: "active", progress: 68, orgId: "org-1", members: ["u-1", "u-2", "u-3"], createdAt: "2025-12-01", updatedAt: "2026-02-20" },
  { id: "p-2", name: "Mobile App v2", description: "Second iteration of the mobile application with new features", status: "active", progress: 42, orgId: "org-1", members: ["u-2", "u-4", "u-5"], createdAt: "2026-01-10", updatedAt: "2026-02-19" },
  { id: "p-3", name: "API Migration", description: "Migrate legacy REST APIs to GraphQL", status: "on-hold", progress: 25, orgId: "org-1", members: ["u-1", "u-3", "u-6"], createdAt: "2026-01-20", updatedAt: "2026-02-15" },
  { id: "p-4", name: "Analytics Dashboard", description: "Build internal analytics dashboard for KPI tracking", status: "active", progress: 85, orgId: "org-1", members: ["u-4", "u-5"], createdAt: "2025-11-15", updatedAt: "2026-02-21" },
  { id: "p-5", name: "DevOps Pipeline", description: "Set up CI/CD pipeline with automated testing", status: "completed", progress: 100, orgId: "org-1", members: ["u-1", "u-6"], createdAt: "2025-10-01", updatedAt: "2026-02-10" },
];

export const mockTasks: Task[] = [
  { id: "t-1", title: "Design new landing page", description: "Create mockups for the new landing page", status: "done", priority: "high", assigneeId: "u-2", projectId: "p-1", tags: ["design", "ui"], dueDate: "2026-02-25", createdAt: "2026-02-01" },
  { id: "t-2", title: "Implement auth flow", description: "Build login and signup pages with JWT", status: "in-progress", priority: "urgent", assigneeId: "u-1", projectId: "p-1", tags: ["backend", "auth"], dueDate: "2026-02-28", createdAt: "2026-02-05" },
  { id: "t-3", title: "Setup database schema", description: "Design and implement MongoDB schemas", status: "in-review", priority: "high", assigneeId: "u-3", projectId: "p-1", tags: ["backend", "database"], dueDate: "2026-02-22", createdAt: "2026-02-03" },
  { id: "t-4", title: "Create component library", description: "Build reusable UI component library", status: "todo", priority: "medium", assigneeId: "u-4", projectId: "p-2", tags: ["frontend", "ui"], dueDate: "2026-03-05", createdAt: "2026-02-10" },
  { id: "t-5", title: "Write unit tests", description: "Add unit tests for core modules", status: "todo", priority: "medium", assigneeId: "u-5", projectId: "p-2", tags: ["testing"], dueDate: "2026-03-10", createdAt: "2026-02-12" },
  { id: "t-6", title: "API documentation", description: "Document all REST API endpoints", status: "in-progress", priority: "low", assigneeId: "u-6", projectId: "p-3", tags: ["docs"], dueDate: "2026-03-01", createdAt: "2026-02-08" },
  { id: "t-7", title: "Performance optimization", description: "Optimize page load and rendering performance", status: "todo", priority: "high", assigneeId: "u-1", projectId: "p-4", tags: ["performance"], dueDate: "2026-03-15", createdAt: "2026-02-15" },
  { id: "t-8", title: "User feedback integration", description: "Add feedback widget to dashboard", status: "in-progress", priority: "medium", assigneeId: "u-2", projectId: "p-4", tags: ["feature", "ui"], dueDate: "2026-02-27", createdAt: "2026-02-14" },
  { id: "t-9", title: "Mobile responsive fixes", description: "Fix responsive layout issues on mobile devices", status: "in-review", priority: "high", assigneeId: "u-4", projectId: "p-1", tags: ["frontend", "mobile"], dueDate: "2026-02-24", createdAt: "2026-02-16" },
  { id: "t-10", title: "S3 bucket configuration", description: "Configure S3 buckets for file storage", status: "done", priority: "urgent", assigneeId: "u-3", projectId: "p-5", tags: ["devops", "aws"], dueDate: "2026-02-10", createdAt: "2026-01-28" },
  { id: "t-11", title: "Email notification service", description: "Build email notification microservice", status: "todo", priority: "low", assigneeId: "u-5", projectId: "p-2", tags: ["backend", "notifications"], dueDate: "2026-03-20", createdAt: "2026-02-18" },
  { id: "t-12", title: "Dashboard charts", description: "Implement Recharts for dashboard analytics", status: "done", priority: "medium", assigneeId: "u-6", projectId: "p-4", tags: ["frontend", "analytics"], dueDate: "2026-02-20", createdAt: "2026-02-11" },
];

export const mockFiles: FileItem[] = [
  { id: "f-1", name: "design-system.fig", type: "figma", size: 4500000, url: "#", projectId: "p-1", uploadedBy: "u-2", uploadedAt: "2026-02-10" },
  { id: "f-2", name: "api-specs.yaml", type: "yaml", size: 125000, url: "#", projectId: "p-3", uploadedBy: "u-1", uploadedAt: "2026-02-08" },
  { id: "f-3", name: "wireframes.pdf", type: "pdf", size: 8200000, url: "#", projectId: "p-1", uploadedBy: "u-2", uploadedAt: "2026-02-12" },
  { id: "f-4", name: "meeting-notes.docx", type: "docx", size: 350000, url: "#", projectId: "p-2", uploadedBy: "u-5", uploadedAt: "2026-02-15" },
  { id: "f-5", name: "brand-assets.zip", type: "zip", size: 25000000, url: "#", projectId: "p-1", uploadedBy: "u-4", uploadedAt: "2026-02-18" },
  { id: "f-6", name: "deployment-guide.md", type: "md", size: 45000, url: "#", projectId: "p-5", uploadedBy: "u-6", uploadedAt: "2026-02-05" },
  { id: "f-7", name: "analytics-report.xlsx", type: "xlsx", size: 1200000, url: "#", projectId: "p-4", uploadedBy: "u-5", uploadedAt: "2026-02-20" },
  { id: "f-8", name: "logo-final.png", type: "png", size: 580000, url: "#", projectId: "p-1", uploadedBy: "u-2", uploadedAt: "2026-02-19" },
];

export const mockActivities: ActivityItem[] = [
  { id: "a-1", userId: "u-1", action: "completed task", target: "Implement auth flow", timestamp: "2026-02-22T09:30:00Z" },
  { id: "a-2", userId: "u-2", action: "uploaded file", target: "logo-final.png", timestamp: "2026-02-22T08:45:00Z" },
  { id: "a-3", userId: "u-3", action: "moved task to review", target: "Setup database schema", timestamp: "2026-02-21T17:20:00Z" },
  { id: "a-4", userId: "u-4", action: "commented on", target: "Mobile responsive fixes", timestamp: "2026-02-21T15:10:00Z" },
  { id: "a-5", userId: "u-5", action: "created project", target: "Mobile App v2", timestamp: "2026-02-21T11:00:00Z" },
  { id: "a-6", userId: "u-6", action: "joined team", target: "API Migration", timestamp: "2026-02-20T14:30:00Z" },
  { id: "a-7", userId: "u-1", action: "updated task priority", target: "Performance optimization", timestamp: "2026-02-20T10:15:00Z" },
  { id: "a-8", userId: "u-2", action: "assigned task to", target: "Sarah Chen → User feedback integration", timestamp: "2026-02-19T16:45:00Z" },
];

export const getUserById = (id: string) => mockUsers.find((u) => u.id === id);
export const getProjectById = (id: string) => mockProjects.find((p) => p.id === id);
export const getTasksByProject = (projectId: string) => mockTasks.filter((t) => t.projectId === projectId);
export const getTasksByStatus = (status: Task["status"]) => mockTasks.filter((t) => t.status === status);
export const getFilesByProject = (projectId: string) => mockFiles.filter((f) => f.projectId === projectId);
export const getUserInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase();
