import { param } from "express-validator";

const userIdValidator = param("id")
  .trim()
  .notEmpty()
  .withMessage("Cannot be empty")
  .isNumeric()
  .withMessage("ID must be numeric")
  .isInt()
  .withMessage("ID must be an integer number")
  .custom((id) => {
    if (id < 0) throw new Error("ID must be a positive number");
    return true;
  });

export { userIdValidator };
