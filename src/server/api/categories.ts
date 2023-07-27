import { Router } from "express";
import { execQuery } from "../../db/execQuery";
import { catchAsyncError } from "../catchAsyncError";

export const categoriesRouter = Router();

categoriesRouter.get(
  "/",
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
