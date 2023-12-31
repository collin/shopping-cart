import { Router } from "express";
import { execQuery } from "../../db/execQuery";
import Products from "../../types/store/Products";
import { catchAsyncError } from "../catchAsyncError";
import { z } from "zod";

export const productsRouter = Router();

const paginationSchema = z.object({
  page: z.coerce.number().int().positive(),
  pageSize: z.coerce.number().int().positive(),
  categoryId: z.coerce.number().int().positive().optional(),
});

productsRouter.get(
  "/",
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
