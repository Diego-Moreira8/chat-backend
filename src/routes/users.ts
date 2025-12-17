import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const usersRouter = Router();

usersRouter.post("/", async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.create({
    data: {
      username,
      password,
      messages: {
        create: {
          content: "Hello, world!",
        },
      },
    },
    include: {
      messages: true,
    },
  });

  res.json(user);
});

export { usersRouter };
