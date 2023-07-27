import "dotenv/config";
import express from "express";

// @ts-expect-error - no types available
import volleyball from "volleyball";
import { apiRouter } from "./api";

export const app = express();

app.use(volleyball);
app.use(express.json());

app.get("/test", (req, res) => {
  res.send("Changing code reloads :)");
});

app.use("/api", apiRouter);
