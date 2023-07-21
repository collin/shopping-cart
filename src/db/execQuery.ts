import { QueryResultRow } from "pg";
import { pool } from "./pool";

export const execQuery = <ResultType extends QueryResultRow>(
  query: Parameters<typeof pool.query>[0],
  values?: Parameters<typeof pool.query>[1]
) => {
  console.log("Executing query:", { query, values });
  return pool.query<ResultType>(query, values);
};
