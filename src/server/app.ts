import "dotenv/config";
import express from "express";

// @ts-expect-error - no types available
import volleyball from "volleyball";
import { execQuery } from "../db/execQuery";
import Products from "../types/store/Products";
import { z } from "zod";
import { catchAsyncError } from "./catchAsyncError";

export const app = express();

app.use(volleyball);
app.use(express.json());

app.get("/test", (req, res) => {
  res.send("Changing code reloads :)");
});

const paginationSchema = z.object({
  page: z.coerce.number().int().positive(),
  pageSize: z.coerce.number().int().positive(),
  categoryId: z.coerce.number().int().positive().optional(),
});

app.get(
  "/api/products",
  catchAsyncError(async (req, res) => {
    const paginationParams = paginationSchema.parse(req.query);

    const limit = paginationParams.pageSize;
    const page = paginationParams.page;
    const categoryId = paginationParams.categoryId;
    const offset = limit * (page - 1);

    if (categoryId) {
      const { rows } = await execQuery<Products>(
        /* SQL */ `
      select
        *
      from
        store.products
      join store.products_categories on
        products_categories.product_id = products.id
      where
        products_categories.category_id = $1
      order by
        id asc
      limit
        $2
      offset
        $3
    `,
        [categoryId, limit, offset],
      );

      res.json(rows);
    } else {
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
    }
  }),
);

app.get(
  "/api/categories",
  catchAsyncError(async (req, res) => {
    const { rows } = await execQuery(/* SQL */ `
    select
      *
    from
      store.categories
    order by
      id asc
  `);

    res.json(rows);
  }),
);
