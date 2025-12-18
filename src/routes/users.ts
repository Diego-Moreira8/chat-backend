import { Router } from "express";
import { createUserValidator } from "../middlewares/validators/createUserValidator.js";
import { createUser } from "../controllers/users.js";
import { validateRequest } from "../middlewares/validators/validateRequest.js";

const usersRouter = Router();

usersRouter.post("/", createUserValidator, validateRequest, createUser);

export { usersRouter };
