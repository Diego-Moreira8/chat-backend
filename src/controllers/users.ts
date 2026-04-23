import type { Request, Response, NextFunction } from "express";
import * as userService from "../services/users.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

async function createUser(req: Request, res: Response, next: NextFunction) {
  const { name, username, password } = req.body;
  const newUser = await userService.createUser(username, password, name);
  res.status(201).json({
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
    user: {
      id,
      username,
      name,
      role,
    },
  });
}

async function getSentMessagesCount(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const count = await userService.getSentMessagesCount(res.locals.user.id);

  res.json({ count });
}

async function getUser(req: Request, res: Response, next: NextFunction) {
  const idParam = req.params.id;
  if (!idParam) return res.status(400).json({ message: "ID not provided" });

  const user = await userService.getUserById(parseInt(idParam));
  if (!user) return res.status(404).json({ message: "User not found" });

  const { id, username, name, role } = user;
  res.json({
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
      accessToken,
    });
}

async function logout(req: Request, res: Response, next: NextFunction) {
  res.clearCookie("refreshToken").sendStatus(204);
}

async function refreshAccessToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userData = res.locals.user;
  const accessToken = generateAccessToken(userData);

  res.json({
    accessToken,
  });
}

async function updateCurrentUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const isChangingPassword = req.body.changePassword;

  const updatedUser = await userService.updateUser(res.locals.user.id, {
    name: req.body.name,
    username: req.body.username,
    ...(isChangingPassword && { password: req.body.newPassword }),
  });

  res.json({
    user: {
      id: updatedUser.id,
      username: updatedUser.username,
      name: updatedUser.name,
      role: updatedUser.role,
    },
  });
}

export {
  createUser,
  getCurrentUser,
  getSentMessagesCount,
  getUser,
  login,
  logout,
  refreshAccessToken,
  updateCurrentUser,
};
