import { Request, Response } from "express";
import File from "../../models/file.model";
import { generateUploadUrl, deleteFromS3 } from "../../utils/s3.util";
import { ENV } from "../../config/env";

// Generate pre-signed URL
export const getUploadUrl = async (req: Request, res: Response) => {
  const { fileName, contentType } = req.body;
  const user = (req as any).user;

  const key = `${user.orgId}/${Date.now()}-${fileName}`;

  const uploadUrl = await generateUploadUrl(key, contentType);

  res.json({
    uploadUrl,
    key,
    publicUrl: `https://${ENV.AWS_S3_BUCKET}.s3.${ENV.AWS_REGION}.amazonaws.com/${key}`,
  });
};

// Save file metadata
export const saveFileMeta = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { name, key, url, size, type, projectId } = req.body;

  const file = await File.create({
    name,
    key,
    url,
    size,
    type,
    projectId: projectId || null,
    orgId: user.orgId,
    uploadedBy: user.id,
  });

  res.status(201).json(file);
};

// Get files
export const getFiles = async (req: Request, res: Response) => {
  const orgId = (req as any).user.orgId;

  const files = await File.find({ orgId }).sort({ createdAt: -1 });

  res.json(files);
};

// Delete file
export const deleteFile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const orgId = (req as any).user.orgId;

  const file = await File.findOne({ _id: id, orgId });

  if (!file) {
    return res.status(404).json({ message: "File not found" });
  }

  await deleteFromS3(file.key);
  await file.deleteOne();

  res.json({ success: true });
};