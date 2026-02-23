import { Request, Response, NextFunction } from "express";

export const authorizeRoles =
  (...allowedRoles: ("admin" | "manager" | "member")[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: "Forbidden: You do not have permission to perform this action",
      });
    }

    next();
  };