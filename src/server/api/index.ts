import { Router } from "express";
import { productsRouter } from "./products";
import { categoriesRouter } from "./categories";

export const apiRouter = Router();

apiRouter.use("/products", productsRouter);
apiRouter.use("/categories", categoriesRouter);
