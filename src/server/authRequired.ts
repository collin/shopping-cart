import { verify } from "jsonwebtoken";
import { Request } from "express";
import { Unauthorized } from "./app";
import { AUTH_COOKIE_NAME, JWT_SESSION_SECRET } from "./api/user";

export const authRequired = (req: Request) => {
  const authCookie = req.cookies[AUTH_COOKIE_NAME];
  if (!authCookie) {
    throw new Unauthorized();
  }

  const jwtPayload = verify(authCookie, JWT_SESSION_SECRET);
  const userId = jwtPayload.sub;

  return userId;
};
