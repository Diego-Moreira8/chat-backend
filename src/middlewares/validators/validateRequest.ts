import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

function validateRequest(req: Request, res: Response, next: NextFunction) {
  const { unexpectedValidationError } = res.locals;

  if (unexpectedValidationError) {
    return next(unexpectedValidationError);
  }

  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({
      message: "Invalid form fields",
      formErrors: result.array(),
    });
  }

  next();
}

export { validateRequest };
