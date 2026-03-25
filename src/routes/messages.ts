import { Router } from "express";
import * as auth from "../middlewares/auth/auth.js";
import * as messagesController from "../controllers/messages.js";
import { messageValidator } from "../middlewares/validators/messageValidator.js";
import { validateRequest } from "../middlewares/validators/validateRequest.js";

const messagesRouter = Router();

messagesRouter.get(
  "/",
  auth.validateAccessToken,
  messagesController.getAllMessages,
);

messagesRouter.post(
  "/",
  auth.validateAccessToken,
  messageValidator,
  validateRequest,
  messagesController.sendMessage,
);

export { messagesRouter };
