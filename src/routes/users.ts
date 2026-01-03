import { Router } from "express";
import * as userController from "../controllers/users.js";
import { adminOnly } from "../middlewares/auth/adminOnly.js";
import { authenticate } from "../middlewares/auth/auth.js";
import { createUserValidator } from "../middlewares/validators/createUserValidator.js";
import { loginValidator } from "../middlewares/validators/loginValidator.js";
import { userIdValidator } from "../middlewares/validators/userIdValidator.js";
import { validateRequest } from "../middlewares/validators/validateRequest.js";

const usersRouter = Router();

usersRouter.post(
  "/",
  createUserValidator,
  validateRequest,
  userController.createUser
);

usersRouter.post(
  "/login",
  loginValidator,
  validateRequest,
  userController.login
);

usersRouter.get("/me", authenticate, userController.getCurrentUser);

usersRouter.get(
  "/:id",
  authenticate,
  adminOnly,
  userIdValidator,
  validateRequest,
  userController.getUser
);

export { usersRouter };
