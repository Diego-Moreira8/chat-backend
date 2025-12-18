import "dotenv/config";
import jwt from "jsonwebtoken";
import type { User } from "../../generated/prisma/client.js";

function generateAccessToken(userData: User) {
  const { JWT_SECRET } = process.env;

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET must be defined on environment variables");
  }

  const accessToken = jwt.sign({ sub: userData.id }, JWT_SECRET, {
    expiresIn: "15min",
  });

  return `Bearer ${accessToken}`;
}

export { generateAccessToken };
