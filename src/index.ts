import "dotenv/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { messagesRouter } from "./routes/messages.js";
import { usersRouter } from "./routes/users.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/users", usersRouter);
app.use("/messages", messagesRouter);

app.listen(PORT, () => {
  if (process.env.NODE_ENV === "development") {
    console.log(`Listening on http://localhost:${PORT}/`);
  }
});
