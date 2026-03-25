import type { Request, Response, NextFunction } from "express";
import * as userService from "../services/users.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

async function createUser(req: Request, res: Response, next: NextFunction) {
  const { name, username, password } = req.body;
  const newUser = await userService.createUser(username, password, name);
  res.status(201).json({
    message: "New user created",
    user: {
      id: newUser.id,
      username: newUser.username,
      name: newUser.name,
      role: newUser.role,
    },
  });
}

function getCurrentUser(req: Request, res: Response, next: NextFunction) {
  const { id, username, name, role } = res.locals.user;
  res.json({
    message: "Success",
    user: {
      id,
      username,
      name,
      role,
    },
  });
}

async function getUser(req: Request, res: Response, next: NextFunction) {
  const idParam = req.params.id;
  if (!idParam) return res.status(400).json({ message: "ID not provided" });

  const user = await userService.getUserById(parseInt(idParam));
  if (!user) return res.status(404).json({ message: "User not found" });

  const { id, username, name, role } = user;
  res.json({
    message: "Success",
    user: {
      id,
      username,
      name,
      role,
    },
  });
}

async function login(req: Request, res: Response, next: NextFunction) {
  const { userData } = res.locals;

  const accessToken = generateAccessToken(userData);
  const refreshToken = generateRefreshToken(userData);

  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .json({
      message: "Success",
      accessToken,
    });
}

async function logout(req: Request, res: Response, next: NextFunction) {
  res.clearCookie("refreshToken").json({
    message: "Success",
  });
}

async function refreshAccessToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userData = res.locals.user;
  const accessToken = generateAccessToken(userData);

  res.json({
    message: "Success",
    accessToken,
  });
}

export {
  createUser,
  getCurrentUser,
  getUser,
  login,
  logout,
  refreshAccessToken,
};
