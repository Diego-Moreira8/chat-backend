import type { Request, Response, NextFunction } from "express";
import * as userService from "../services/users.js";
import { generateAccessToken } from "../utils/jwt.js";

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

  const token = generateAccessToken(userData);

  res.json({
    message: "Success",
    token,
  });
}

export { createUser, getCurrentUser, getUser, login };
