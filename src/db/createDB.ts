import { Client } from "pg";

export async function createDB() {
  /**
   * This function creates a new database with the name specified in the
   * DATABASE_URL env var.
   *
   * For example, if DATABASE_URL is postgres://postgres:postgres@localhost:5432/shopping-cart,
   * then this function will create a database named shopping-cart.
   *
   * This function uses its own database client because the common pool requires a database to
   * exist before it can connect to it.
   *
   * This function is idempotent, meaning that it can be run multiple times without
   * causing any problems. This is ensured by catching errors when creating the database. It is assumed
   * the most likely error is that the database already exists.
   */
  if (!process.env.DATABASE_URL) {
    throw new Error("Missing env var: DATABASE_URL");
  }
  const databaseUrl = new URL(process.env.DATABASE_URL);
  const postgresUrl = databaseUrl.href.slice(
    0,
    databaseUrl.href.length - databaseUrl.pathname.length
  );
  const databaseName = databaseUrl.pathname.slice(1);

  const client = new Client(postgresUrl);
  try {
    await client.connect();

    console.log("Creating database", databaseName);
    await client
      .query(/* SQL */ `CREATE DATABASE "${databaseName}"`)
      .then(() => {
        console.log(`Created database ${databaseName}`);
      })
      .catch((error) => {
        if (error.message.includes("already exists")) {
          console.log("Database already exists. ");
        } else {
          throw error;
        }
      });
  } finally {
    await client.end();
  }
}
