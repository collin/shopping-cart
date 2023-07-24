import "dotenv/config";
import express from "express";

// @ts-expect-error - no types available
import volleyball from "volleyball";
import { execQuery } from "../db/execQuery";
import Products from "../types/store/Products";
import { z } from "zod";

export const app = express();

app.use(volleyball);

app.get("/test", (req, res) => {
  res.send("Changing code reloads :)");
});

const paginationSchema = z.object({
  page: z.coerce.number().int().positive(),
  pageSize: z.coerce.number().int().positive(),
});

app.get("/api/products", async (req, res) => {
  const paginationParams = paginationSchema.parse(req.query);

  const limit = paginationParams.pageSize;
  const page = paginationParams.page;
  const offset = limit * (page - 1);

  const { rows } = await execQuery<Products>(
    /* SQL */ `
    select
      *
    from
      store.products
    order by
      id asc
    limit
      $1
    offset
      $2
  `,
    [limit, offset],
  );

  res.json(rows);
});
