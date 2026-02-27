import { Router } from "express";
import {
  getUploadUrl,
  saveFileMeta,
  getFiles,
  deleteFile,
} from "./file.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/upload-url", getUploadUrl);
router.post("/", saveFileMeta);
router.get("/", getFiles);
router.delete("/:id", deleteFile);

export default router;