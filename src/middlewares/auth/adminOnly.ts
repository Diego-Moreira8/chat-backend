import type { Request, Response, NextFunction } from "express";
import type { User } from "../../../generated/prisma/client.js";

function adminOnly(req: Request, res: Response, next: NextFunction) {
  const user: User = res.locals.user;

  if (user.role === "USER") {
    return res
      .status(401)
      .json({ message: "Only admins can access this resource" });
  }

  next();
}

export { adminOnly };
