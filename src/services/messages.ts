import { prisma } from "../lib/prisma.js";

async function createMessage(userId: number, content: string) {
  const newMessage = await prisma.message.create({
    data: {
      userId,
      content,
    },
  });

  return newMessage;
}

async function getAllMessages() {
  const allMessages = await prisma.message.findMany({
    include: {
      user: true,
    },
  });

  const mappedMsgs = allMessages.map((msg) => {
    return {
      message: {
        id: msg.id,
        content: msg.content,
        createdAt: msg.createdAt,
      },
      user: {
        name: msg.user.name,
        username: msg.user.username,
      },
    };
  });

  return mappedMsgs;
}

export { createMessage, getAllMessages };
