import { Router } from "express";
import {
  getOrganization,
  updateOrganization,
  getTeamMembers,
  getProjects,
  getTasks,
  getFiles,
  getActivities,
  getProjectMembers,
} from "./org.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { authorizeRoles } from "../../middlewares/role.middleware";

const router = Router();

router.use(authMiddleware);

// Get org info (all roles)
router.get("/", getOrganization);

// Update org (admin only)
router.patch("/", authorizeRoles("admin"), updateOrganization);

// Get team members
router.get("/members", getTeamMembers);

router.get("/projects", getProjects);
router.get("/tasks", getTasks);
router.get("/team", getTeamMembers); // alias for frontend
router.get("/files", getFiles);
router.get("/activities", getActivities);
router.get("/projects/:id/members", getProjectMembers);

export default router;