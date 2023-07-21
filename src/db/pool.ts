import "dotenv/config";
import { Pool } from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("Missing env var: DATABASE_URL");
}

export const pool = new Pool({
  // postgres://postgres:postgres@localhost:5432/shopping-cart
  connectionString: process.env.DATABASE_URL,
  max: 10,
  min: 1,
  idleTimeoutMillis: 5000,
  allowExitOnIdle: true,
});

pool.on("error", (err) => {
  console.error("Unexpected pg error", err);
  process.exit(1);
});
