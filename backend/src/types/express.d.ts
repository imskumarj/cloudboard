import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      orgId: string;
      role: "admin" | "manager" | "member";
    };
  }
}