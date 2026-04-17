import { PrismaPg } from "@prisma/adapter-pg";
import { envVar } from "../utils/env-variables.js";
import { PrismaClient } from "../../generated/prisma/client.js";

const connectionString = `${envVar.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
