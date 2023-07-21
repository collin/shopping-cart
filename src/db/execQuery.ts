import { pool } from "./pool";

export const execQuery = (query: string, values?: []) => {
  return pool.query(query, values);
};
