import { Router } from "express";
import {
  getOrganization,
  updateOrganization,
  getTeamMembers,
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

export default router;