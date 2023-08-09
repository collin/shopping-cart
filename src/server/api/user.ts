import crypto, { BinaryLike } from "node:crypto";
import { sign } from "jsonwebtoken";
import { NextFunction, Response, Router } from "express";
import { catchAsyncError } from "../catchAsyncError";
import { execQuery } from "../../db/execQuery";
import { z } from "zod";
import Users from "../../types/users/Users";
import { authRequired } from "../authRequired";

const scryptPromise = (
  password: BinaryLike,
  salt: BinaryLike,
  keyLength: number,
) =>
  new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, keyLength, (err, derivedKey) => {
      if (err) {
        reject(err);
      } else {
        resolve(derivedKey);
      }
    });
  });

export const userRouter = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  displayName: z.string(),
});

export type RegisteredUser = Pick<
  Users,
  "id" | "display_name" | "email_address"
>;

if (!process.env.JWT_SESSION_SECRET) {
  throw new Error("JWT_SESSION_SECRET not set");
}

export const JWT_SESSION_SECRET = process.env.JWT_SESSION_SECRET;
export const AUTH_COOKIE_NAME = "auth";

userRouter.post(
  "/register",
  catchAsyncError(async (req, res) => {
    const { email, password, displayName } = registerSchema.parse(req.body);
    // generate salt and hash with scrpyt
    const salt = crypto.randomBytes(16);
    const hashedPassword = await scryptPromise(password, salt, 64);

    console.log(email, password, displayName, salt, hashedPassword);
    // TODO: figure out how to type this without the assertion
    const {
      rows: [user],
    } = await execQuery<RegisteredUser>(
      /* SQL */ `
        insert into users.users (email_address, salt, hashed_password, display_name)
        values ($1, $2, $3, $4)
        returning id, email_address, display_name
      `,
      [email, salt, hashedPassword, displayName],
    );

    if (!user) {
      throw new Error("Failed to create user");
    }

    const token = sign({ role: "user" }, JWT_SESSION_SECRET, {
      subject: user.id,
    });

    res.cookie(AUTH_COOKIE_NAME, token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });

    res.json(user);
  }),
);

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

userRouter.post(
  "/login",
  catchAsyncError(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);

    const {
      rows: [user],
    } = await execQuery<Users>(
      /* SQL */ `
        select id, email_address, display_name, hashed_password, salt
        from users.users
        where email_address = $1
      `,
      [email],
    );

    if (!user) {
      throw new Error("User not found");
    }

    const hashedPassword = await scryptPromise(password, user.salt, 64);

    if (!hashedPassword.equals(user.hashed_password)) {
      throw new Error("Incorrect password");
    }

    const token = sign({ role: "user" }, JWT_SESSION_SECRET, {
      subject: user.id,
    });

    res.cookie(AUTH_COOKIE_NAME, token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });

    // TODO: this response includes the salt and hashed password which we should
    // NEVER expose outside of a trusted context like our server
    res.json({
      id: user.id,
      display_name: user.display_name,
      email_address: user.email_address,
    });
  }),
);

userRouter.get(
  "/me",
  catchAsyncError(async (req, res) => {
    const userId = authRequired(req);
    const {
      rows: [user],
    } = await execQuery<RegisteredUser>(
      /* SQL */ `
        select id, email_address, display_name
        from users.users
        where id = $1
      `,
      [userId],
    );

    res.json(user);
  }),
);

userRouter.post(
  "/logout",
  catchAsyncError(async (req, res) => {
    res.clearCookie(AUTH_COOKIE_NAME);
    res.json({ success: true });
  }),
);
