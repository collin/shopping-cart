import { pool } from "./pool";

export const execQuery = (query: string, values?: []) => {
  console.log("Executing query:", { query, values });
  return pool.query(query, values);
};
