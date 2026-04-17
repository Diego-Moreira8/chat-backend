import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import logger from "morgan";
import { messagesRouter } from "./routes/messages.js";
import { usersRouter } from "./routes/users.js";
import { envVar } from "./utils/env-variables.js";

const app = express();

app.use(helmet());
app.use(logger("dev"));
app.use(
  cors({
    origin: envVar.CORS_ORIGINS,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", usersRouter);
app.use("/messages", messagesRouter);

app.listen(envVar.PORT, () => {
  if (envVar.NODE_ENV === "development") {
    console.log(`Listening on http://localhost:${envVar.PORT}/`);
  }
});
