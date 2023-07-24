import { RequestHandler } from "express";

export const catchAsyncError = (endpoint: RequestHandler): RequestHandler => {
  return async (req, res, next) => {
    try {
      await endpoint(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};
