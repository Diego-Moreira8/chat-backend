import { body } from "express-validator";

const messageValidator = body("messageContent")
  .trim()
  .notEmpty()
  .withMessage("Cannot be empty")
  .isLength({ max: 250 })
  .withMessage("Maximum of 250 characters are allowed");

export { messageValidator };
