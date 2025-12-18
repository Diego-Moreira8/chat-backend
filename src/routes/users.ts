import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { comparePassword, encryptPassword } from "../utils/bcrypt.js";

const usersRouter = Router();

usersRouter.post("/", async (req, res) => {
  const { username, password } = req.body;

  const encryptedPassword = await encryptPassword(password);

  const user = await prisma.user.create({
    data: {
      username,
      password: encryptedPassword,
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

usersRouter.get("/", async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) return res.status(400).send("Usuário não encontrado");

  const passwordMatch = await comparePassword(password, user.password);

  if (!passwordMatch) return res.status(400).send("Senha incorreta");

  res.sendStatus(200);
});

export { usersRouter };
