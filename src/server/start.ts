import ViteExpress from "vite-express";
import { app } from "./app";

const port = parseInt(process.env.PORT || "3000");

ViteExpress.listen(app, port, () => {
  return console.log(`server is listening on ${port}`);
});
