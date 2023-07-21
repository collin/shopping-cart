import { pool } from "./pool";

export const execQuery = (
  query: Parameters<typeof pool.query>[0],
  values?: Parameters<typeof pool.query>[1]
) => {
  console.log("Executing query:", { query, values });
  return pool.query(query, values);
};
