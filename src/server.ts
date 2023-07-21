import "dotenv/config";
import express from "express";
import ViteExpress from "vite-express";
// @ts-expect-error - no types available
import volleyball from "volleyball";

const app = express();
const port = parseInt(process.env.PORT || "3000");

app.use(volleyball);

app.get("/test", (req, res) => {
  res.send("The sedulous hyena ate the antelope!");
});

ViteExpress.listen(app, port, () => {
  return console.log(`server is listening on ${port}`);
});
