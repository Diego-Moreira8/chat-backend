import "dotenv/config";

function getEnv(key: string) {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing env: ${key}`);
  }

  return value;
}

export const envVar = {
  CORS_ORIGINS: getEnv("CORS_ORIGINS"),
  DATABASE_URL: getEnv("DATABASE_URL"),
  JWT_SECRET: getEnv("JWT_SECRET"),
  NODE_ENV: getEnv("NODE_ENV"),
  PORT: getEnv("PORT"),
};
