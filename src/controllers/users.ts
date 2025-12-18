import type { Request, Response, NextFunction } from "express";
import * as userService from "../services/users.js";
import { generateAccessToken } from "../utils/jwt.js";

async function createUser(req: Request, res: Response, next: NextFunction) {
  const { name, username, password } = req.body;
  const newUser = await userService.createUser(username, password, name);
  res.json({ message: "Success", newUser });
}

async function login(req: Request, res: Response, next: NextFunction) {
  const { username, password } = req.body;
  const { userData } = res.locals;

  const token = generateAccessToken(userData);

  res.json({
    message: "Success",
    user: { username, password },
    userData,
    token,
  });
}

export { createUser, login };
