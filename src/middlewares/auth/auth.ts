import "dotenv/config";
import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { getUserById } from "../../services/users.js";

interface AuthPayload extends JwtPayload {
  sub: string;
}

async function authenticate(req: Request, res: Response, next: NextFunction) {
  const { JWT_SECRET } = process.env;

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET must be defined on environment variables");
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Missing access token" });
  }

  const token = authHeader.split(" ")[1];

  if (!authHeader.startsWith("Bearer ") || !token) {
    return res.status(401).json({ message: "Invalid authorization format" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === "string") {
      return res.status(401).json({ message: "Invalid access token payload" });
    }

    const payload = decoded as AuthPayload;
    const userData = await getUserById(parseInt(payload.sub));

    if (!userData) {
      return res
        .status(401)
        .json({ message: "User not found, impossible to authenticate" });
    }

    res.locals.user = userData;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
}

export { authenticate };
