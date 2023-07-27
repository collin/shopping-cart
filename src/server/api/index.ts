import { Router } from "express";
import { userRouter } from "./user";
import { productsRouter } from "./products";
import { categoriesRouter } from "./categories";

export const apiRouter = Router();

apiRouter.use("/products", productsRouter);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/user", userRouter);
