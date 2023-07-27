import crypto from "node:crypto";
import { promisify } from "node:util";
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

export type RegisteredUser = Pick<Users, "display_name" | "email_address">;

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
        returning email_address, display_name
      `,
      [email, salt, hashedPassword, displayName],
    );

    if (!user) {
      throw new Error("Failed to create user");
    }

    res.json(user);
  }),
);
