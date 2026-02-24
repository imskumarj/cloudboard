import { Router } from "express";
import {
  getTeamMembers,
  approveMember,
  declineMember,
  changeRole,
} from "./team.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { authorizeRoles } from "../../middlewares/role.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getTeamMembers);

router.patch(
  "/:userId/approve",
  authorizeRoles("admin"),
  approveMember
);

router.delete(
  "/:userId/decline",
  authorizeRoles("admin"),
  declineMember
);

router.patch(
  "/:userId/role",
  authorizeRoles("admin"),
  changeRole
);

export default router;