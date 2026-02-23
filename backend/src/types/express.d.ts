declare namespace Express {
  interface Request {
    user?: {
      id: string;
      orgId: string;
      role: "admin" | "manager" | "member";
    };
  }
}