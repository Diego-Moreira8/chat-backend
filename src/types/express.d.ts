import type { User } from "../../generated/prisma/client.ts";

declare global {
  namespace Express {
    interface Locals {
      user: User;
    }
  }
}

export {};
