import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(helmet());
app.use(cors());

app.get("/", (req, res) => res.json({ data: "Hello!" }));

app.listen(PORT, () => {
  if (process.env.NODE_ENV === "development") {
    console.log(`Listening on http://localhost:${PORT}/`);
  }
});
