import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
import jwt from "jsonwebtoken";
import { getUserById } from "../../services/users.js";

interface AuthPayload extends JwtPayload {
  sub: string;
}

function getJwtSecret() {
  const { JWT_SECRET } = process.env;

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET must be defined on environment variables");
  }

  return JWT_SECRET;
}

async function validateAccessToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const jwtSecret = getJwtSecret();

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Missing access token" });
  }

  const token = authHeader.split(" ")[1];

  if (!authHeader.startsWith("Bearer ") || !token) {
    return res.status(401).json({ message: "Invalid authorization format" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    if (typeof decoded === "string") {
      return res.status(401).json({ message: "Invalid access token payload" });
    }

    const payload = decoded as AuthPayload;
    const userId = parseInt(payload.sub);

    if (isNaN(userId)) {
      return res.status(401).json({ message: "Invalid access token payload" });
    }

    const userData = await getUserById(userId);

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

async function validateRefreshToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const jwtSecret = getJwtSecret();
    const { refreshToken } = req.cookies;

    if (typeof refreshToken === "undefined") {
      return res
        .status(401)
        .json({ message: "Refresh token cookie not present" });
    }

    const decoded = jwt.verify(refreshToken, jwtSecret);

    if (typeof decoded === "string") {
      return res.status(401).json({ message: "Invalid refresh token payload" });
    }

    const payload = decoded as AuthPayload;
    const userId = parseInt(payload.sub);

    if (isNaN(userId)) {
      return res.status(401).json({ message: "Invalid refresh token payload" });
    }

    const userData = await getUserById(userId);

    if (!userData) {
      return res.status(401).json({
        message: "User not found, impossible to refresh the access token",
      });
    }

    res.locals.user = userData;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }
}

export { validateAccessToken, validateRefreshToken };
