import { Router } from "express";
import * as userController from "../controllers/users.js";
import { adminOnly } from "../middlewares/auth/adminOnly.js";
import * as auth from "../middlewares/auth/auth.js";
import { createUserValidator } from "../middlewares/validators/createUserValidator.js";
import { loginValidator } from "../middlewares/validators/loginValidator.js";
import { userIdValidator } from "../middlewares/validators/userIdValidator.js";
import { validateRequest } from "../middlewares/validators/validateRequest.js";
import { updateUserValidator } from "../middlewares/validators/updateUserValidator.js";

const usersRouter = Router();

usersRouter.post(
  "/",
  createUserValidator,
  validateRequest,
  userController.createUser,
);

usersRouter.post(
  "/login",
  loginValidator,
  validateRequest,
  userController.login,
);

usersRouter.get("/logout", userController.logout);

usersRouter.get("/me", auth.validateAccessToken, userController.getCurrentUser);

usersRouter.patch(
  "/me",
  auth.validateAccessToken,
  updateUserValidator,
  validateRequest,
  userController.updateCurrentUser,
);

usersRouter.get(
  "/messages-count",
  auth.validateAccessToken,
  userController.getSentMessagesCount,
);

usersRouter.get(
  "/refresh",
  auth.validateRefreshToken,
  userController.refreshAccessToken,
);

usersRouter.get(
  "/:id",
  auth.validateAccessToken,
  adminOnly,
  userIdValidator,
  validateRequest,
  userController.getUser,
);

export { usersRouter };
