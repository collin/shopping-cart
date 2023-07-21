import { Pool } from "pg";

export const pool = new Pool({
  // postgres://postgres:postgres@localhost:5432/shopping-cart
  connectionString: process.env.DATABASE_URL,
  max: 10,
  min: 1,
  idleTimeoutMillis: 5000,
});
