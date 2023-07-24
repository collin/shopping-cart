import ViteExpress from "vite-express";
import { app } from "./app";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

const port = parseInt(process.env.PORT || "3000");

ViteExpress.listen(app, port, () => {
  return console.log(`server is listening on ${port}`);
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    res.status(400).send(err.issues);
  } else {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  }
});
