import { Router } from "express";
import { authenticate } from "../middlewares/auth/auth.js";
import * as messagesController from "../controllers/messages.js";
import { messageValidator } from "../middlewares/validators/messageValidator.js";
import { validateRequest } from "../middlewares/validators/validateRequest.js";

const messagesRouter = Router();

messagesRouter.get("/", authenticate, (req, res, next) => {
  res.json({ userData: res.locals.user });
});

messagesRouter.post(
  "/",
  authenticate,
  messageValidator,
  validateRequest,
  messagesController.sendMessage
);

export { messagesRouter };
