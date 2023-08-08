import crypto from "node:crypto";
import { promisify } from "node:util";
import { sign } from "jsonwebtoken";
import { Router } from "express";
import { catchAsyncError } from "../catchAsyncError";
import { execQuery } from "../../db/execQuery";
import { z } from "zod";
import Users from "../../types/users/Users";

const scrpytPromise = promisify(crypto.scrypt);

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

const JWT_SESSION_SECRET = process.env.JWT_SESSION_SECRET;

userRouter.post(
  "/register",
  catchAsyncError(async (req, res) => {
    const { email, password, displayName } = registerSchema.parse(req.body);
    // generate salt and hash with scrpyt
    const salt = crypto.randomBytes(16);
    const hashedPassword = await scrpytPromise(password, salt, 64);

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

    res.cookie("token", token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });

    res.json(user);
  }),
);
