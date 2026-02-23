import { Router } from "express";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "./project.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { authorizeRoles } from "../../middlewares/role.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getProjects);

router.post(
  "/",
  authorizeRoles("admin", "manager"),
  createProject
);

router.patch(
  "/:id",
  authorizeRoles("admin", "manager"),
  updateProject
);

router.delete(
  "/:id",
  authorizeRoles("admin"),
  deleteProject
);

export default router;