import type { Request, Response, NextFunction } from "express";
import * as messagesService from "../services/messages.js";

async function getAllMessages(req: Request, res: Response, next: NextFunction) {
  const allMessages = await messagesService.getAllMessages();

  res.json({
    allMessagesData: allMessages,
  });
}

async function sendMessage(req: Request, res: Response, next: NextFunction) {
  const { messageContent } = req.body;
  const { id } = res.locals.user;

  const newMessage = await messagesService.createMessage(id, messageContent);

  res.json({
    messageData: newMessage,
  });
}

export { getAllMessages, sendMessage };
