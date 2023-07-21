import "dotenv/config";
import express from "express";

// @ts-expect-error - no types available
import volleyball from "volleyball";
import { execQuery } from "../db/execQuery";
import Products from "../types/store/Products";

export const app = express();

app.use(volleyball);

app.get("/test", (req, res) => {
  res.send("Changing code reloads :)");
});

app.get("/api/products", async (req, res) => {
  const { rows } = await execQuery<Products>(/* SQL */ `
    select * from store.products limit 10
  `);

  res.json(rows);
});
