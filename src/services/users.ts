import { prisma } from "../lib/prisma.js";
import { encryptPassword } from "../utils/bcrypt.js";

async function createUser(username: string, password: string, name: string) {
  const encryptedPassword = await encryptPassword(password);

  const newUser = await prisma.user.create({
    data: {
      username,
      password: encryptedPassword,
      name: name || null,
    },
  });

  return newUser;
}

async function getUserById(id: number) {
  const user = await prisma.user.findUnique({ where: { id } });
  return user;
}

async function getSentMessagesCount(userId: number) {
  const count = await prisma.message.count({ where: { userId } });
  return count;
}

async function usernameExists(username: string) {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
  });

  return user;
}

export { createUser, getSentMessagesCount, getUserById, usernameExists };
