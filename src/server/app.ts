import "dotenv/config";
import express from "express";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

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

app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    res.status(400).json(err.issues);
  } else {
    console.error("Unexpected Server Error", err?.message, err?.stack, {
      method: req.method,
      url: req.url,
      body: req.body,
    });
    res.status(500).send("Unexpected Server Error");
  }
});
