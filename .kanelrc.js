require("dotenv/config");

if (!process.env.DATABASE_URL) {
  throw new Error("Missing env var: DATABASE_URL");
}

module.exports = {
  outputPath: "./src/types",
  connection: process.env.DATABASE_URL,
  customTypeMap: {
    "pg_catalog.bytea": "Buffer",
  },
};
