import { body } from "express-validator";
import { usernameExists } from "../../services/users.js";
import { comparePassword } from "../../utils/bcrypt.js";
import type { Request, Response, NextFunction } from "express";

const updateUserValidator = [
  body("name")
    .trim()
    .isLength({ max: 250 })
    .withMessage("Maximum of 250 characters allowed"),

  body("username")
    .trim()
    .notEmpty()
    .withMessage("Cannot be empty")
    .toLowerCase()
    .isLength({ min: 3, max: 50 })
    .withMessage("Minimum of 3 and maximum of 50 characters are allowed")
    .matches(/^[A-Za-z0-9._-]+$/)
    .withMessage(
      "Username may only include letters, numbers, dots (.), underscores (_) and dashes (-). Spaces are not allowed.",
    )
    .custom(async function isAvailable(username, { req }) {
      // Avoid unnecessary queries
      const noChanges = username === req.res.locals.user.username;

      if (!username || noChanges) return true;

      const inputError = new Error(
        `Username '${username}' already exists in the database`,
      );

      try {
        const usernameTaken = await usernameExists(username);
        if (usernameTaken) throw inputError;
        return true;
      } catch (error) {
        if (error !== inputError) {
          req.res.locals.unexpectedValidationError = error;
        }

        throw inputError;
      }
    }),

  async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.changePassword) {
      await body("currentPassword")
        .notEmpty()
        .withMessage("Cannot be empty")
        .custom(async function checkPassword(password, { req }) {
          // Avoid unnecessary processing
          if (!req.body.username) return true;

          const inputError = new Error("The current password is incorrect.");

          try {
            const passwordHash = req.res.locals.user.password;
            const passwordMatch = await comparePassword(password, passwordHash);

            if (!passwordMatch) throw inputError;

            return true;
          } catch (error) {
            if (error !== inputError) {
              req.res.locals.unexpectedValidationError = error;
            }

            throw inputError;
          }
        })
        .run(req);

      await body("newPassword")
        .notEmpty()
        .withMessage("Cannot be empty")
        .isLength({ min: 8, max: 250 })
        .withMessage("Minimum of 8 and maximum of 250 characters are allowed")
        .custom(function isEqualToUsername(newPw, { req }) {
          if (newPw === req.body.username) {
            throw new Error("Password cannot be equal to the username");
          }

          return true;
        })
        .matches(/^(?=.*[A-Za-z])(?=.*\d).+$/)
        .withMessage("Password must include at least one letter and one number")
        .run(req);

      await body("newPasswordConfirmation")
        .notEmpty()
        .withMessage("Cannot be empty")
        .custom(function passwordsMatch(newPwConfirmation, { req }) {
          if (req.body.newPassword !== newPwConfirmation) {
            throw new Error("Passwords don't match");
          }

          return true;
        })
        .run(req);
    }

    next();
  },
];

export { updateUserValidator };
