import { Router } from "express";
import { createUserValidator } from "../middlewares/validators/createUserValidator.js";
import { createUser, login } from "../controllers/users.js";
import { validateRequest } from "../middlewares/validators/validateRequest.js";
import { loginValidator } from "../middlewares/validators/loginValidator.js";

const usersRouter = Router();

usersRouter.post("/", createUserValidator, validateRequest, createUser);

usersRouter.get("/login", loginValidator, validateRequest, login);

export { usersRouter };
