import { Router } from "express";
import { authenticate } from "../middlewares/auth/auth.js";
import * as messagesController from "../controllers/messages.js";
import { messageValidator } from "../middlewares/validators/messageValidator.js";
import { validateRequest } from "../middlewares/validators/validateRequest.js";

const messagesRouter = Router();

messagesRouter.get("/", authenticate, messagesController.getAllMessages);

messagesRouter.post(
  "/",
  authenticate,
  messageValidator,
  validateRequest,
  messagesController.sendMessage
);

export { messagesRouter };
