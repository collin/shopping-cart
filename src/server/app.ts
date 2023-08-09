import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

// @ts-expect-error - no types available
import volleyball from "volleyball";
import { apiRouter } from "./api";

export const app = express();

app.use(volleyball);
app.use(express.json());
app.use(cookieParser());

app.get("/test", (req, res) => {
  res.send("Changing code reloads :)");
});

app.use("/api", apiRouter);

class HttpError extends Error {
  public status: number = 500;
  public message: string = "Internal Server Error";
}

export class Unauthorized extends HttpError {
  public status = 401;
  public message = "Unauthorized";
}

export class Forbidden extends HttpError {
  public status = 403;
  public message = "Forbidden";
}

app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    res.status(err.status).send(err.message);
  } else if (err instanceof ZodError) {
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
