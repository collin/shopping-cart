import "dotenv/config";
import express from "express";
// @ts-expect-error - no types available
import volleyball from "volleyball";

const app = express();
const port = parseInt(process.env.PORT || "3000");

app.use(volleyball);

app.get("/", (req, res) => {
  res.send("The sedulous hyena ate the antelope!");
});

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});
