import { body } from "express-validator";
import { usernameExists } from "../../services/users.js";
import { comparePassword } from "../../utils/bcrypt.js";

const loginValidator = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Cannot be empty")
    .toLowerCase()
    .custom(async function checkExistence(username, { req }) {
      if (!username) return true; // Avoid unnecessary queries

      const inputError = new Error("Username not found");

      try {
        const userFound = await usernameExists(username);

        if (!userFound) throw inputError;

        req.res.locals.userData = userFound;

        return true;
      } catch (error) {
        if (error !== inputError) {
          req.res.locals.unexpectedValidationError = error;
        }

        throw inputError;
      }
    }),

  body("password")
    .notEmpty()
    .withMessage("Cannot be empty")
    .custom(async function checkPassword(password, { req }) {
      // Avoid unnecessary processing
      const usernameNotFound = typeof req.res.locals.userData === "undefined";
      if (!req.body.username || usernameNotFound) return true;

      const inputError = new Error("Wrong password");

      try {
        const passwordHash = req.res.locals.userData.password;
        const passwordMatch = await comparePassword(password, passwordHash);

        if (!passwordMatch) throw inputError;

        return true;
      } catch (error) {
        if (error !== inputError) {
          req.res.locals.unexpectedValidationError = error;
        }

        throw inputError;
      }
    }),
];

export { loginValidator };
