import "dotenv/config";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

function authenticate(req: Request, res: Response, next: NextFunction) {
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
    const payload = jwt.verify(token, JWT_SECRET);
    res.locals.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export { authenticate };
