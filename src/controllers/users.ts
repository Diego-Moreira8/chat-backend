import type { Request, Response, NextFunction } from "express";

function createUser(req: Request, res: Response, next: NextFunction) {
  const { name, username, password, passwordConfirmation } = req.body;
  res.json({ name, username, password, passwordConfirmation });
}

export { createUser };
