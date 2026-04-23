import { prisma } from "../lib/prisma.js";
import { encryptPassword } from "../utils/bcrypt.js";

interface UpdateUserInput {
  name: string | null;
  username: string;
  password?: string;
}

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

async function updateUser(userId: number, input: UpdateUserInput) {
  if (input.password) {
    input.password = await encryptPassword(input.password);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name: input.name || null,
      ...(input.username && { username: input.username }),
      ...(input.password && { password: input.password }),
    },
  });

  return updatedUser;
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

export {
  createUser,
  getSentMessagesCount,
  getUserById,
  updateUser,
  usernameExists,
};
