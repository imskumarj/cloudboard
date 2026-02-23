import { Router } from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "./task.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { authorizeRoles } from "../../middlewares/role.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getTasks);

router.post(
  "/",
  authorizeRoles("admin", "manager"),
  createTask
);

router.patch(
  "/:id",
  authorizeRoles("admin", "manager"),
  updateTask
);

router.delete(
  "/:id",
  authorizeRoles("admin"),
  deleteTask
);

export default router;