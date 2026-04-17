import jwt from "jsonwebtoken";
import { envVar } from "./env-variables.js";
import type { User } from "../../generated/prisma/client.js";

function generateAccessToken(userData: User) {
  const accessToken = jwt.sign({ sub: userData.id }, envVar.JWT_SECRET, {
    expiresIn: "15min",
  });

  return `Bearer ${accessToken}`;
}

function generateRefreshToken(userData: User) {
  const refreshToken = jwt.sign({ sub: userData.id }, envVar.JWT_SECRET, {
    expiresIn: "7d",
  });

  return refreshToken;
}

export { generateAccessToken, generateRefreshToken };
