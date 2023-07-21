import "dotenv/config";
import express from "express";

// @ts-expect-error - no types available
import volleyball from "volleyball";

export const app = express();

app.use(volleyball);

app.get("/test", (req, res) => {
  res.send("Changing code reloads :)");
});
