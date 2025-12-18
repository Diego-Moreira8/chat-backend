import { body } from "express-validator";
import { isUsernameTaken } from "../../services/users.js";

const createUserValidator = [
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
      "Username may only include letters, numbers, dots (.), underscores (_) and dashes (-). Spaces are not allowed."
    )
    .custom(async function isAvailable(username, { req }) {
      if (!username) return true; // Avoid unnecessary queries

      const inputError = new Error(
        `Username '${username}' already exists in the database`
      );

      try {
        const usernameTaken = await isUsernameTaken(username);
        if (usernameTaken) throw inputError;
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
    .isLength({ min: 8, max: 250 })
    .withMessage("Minimum of 8 and maximum of 250 characters are allowed")
    .custom(function isEqualToUsername(password, { req }) {
      if (password === req.body.username) {
        throw new Error("Password cannot be equal to the username");
      }

      return true;
    })
    .matches(/^(?=.*[A-Za-z])(?=.*\d).+$/)
    .withMessage("Password must include at least one letter and one number"),

  body("passwordConfirmation")
    .notEmpty()
    .withMessage("Cannot be empty")
    .custom(function passwordsMatch(pwConfirmation, { req }) {
      if (req.body.password !== pwConfirmation) {
        throw new Error("Passwords don't match");
      }

      return true;
    }),
];

export { createUserValidator };
