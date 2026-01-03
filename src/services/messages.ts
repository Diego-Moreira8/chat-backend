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

export { createMessage };
