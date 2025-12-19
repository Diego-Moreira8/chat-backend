import { Router } from "express";

const messagesRouter = Router();

messagesRouter.get("/", (req, res, next) => {
  res.json({ userData: res.locals.user });
});

export { messagesRouter };
