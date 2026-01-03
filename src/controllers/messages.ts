import type { Request, Response, NextFunction } from "express";
import { createMessage } from "../services/messages.js";

async function sendMessage(req: Request, res: Response, next: NextFunction) {
  const { messageContent } = req.body;
  const { id } = res.locals.user;

  const newMessage = await createMessage(id, messageContent);

  res.json({
    message: "Message stored",
    messageData: newMessage,
  });
}

export { sendMessage };
