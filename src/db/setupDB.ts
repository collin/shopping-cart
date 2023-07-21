import { execQuery } from "./execQuery";
import { faker } from "@faker-js/faker";

const SEED_PRODUCT_COUNT = parseInt(process.env.SEED_PRODUCT_COUNT || "100");

async function setupDB() {
  // drop existing tables/schema
  await execQuery(/* SQL */ `
    DROP SCHEMA IF EXISTS store CASCADE;
  `);

  // create new tables/schema
  await execQuery(/* SQL */ `CREATE SCHEMA store`);
  // Table store.products {
  //   id bigserial pk // integer
  //   title text [not null]
  //   description text [not null]
  //   price integer [not null, default: 0, note: 'must be >= 0']
  // }

  await execQuery(/* SQL */ `
    CREATE TABLE store.products (
      id BIGSERIAL PRIMARY KEY, 
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      price INTEGER NOT NULL CHECK (price >= 0)
    )`);

  // create initial fake product data
  for (let i = 0; i < SEED_PRODUCT_COUNT; i++) {
    await execQuery(
      /* SQL */ `
      INSERT INTO store.products (title, description, price)
      VALUES ($1, $2, $3)
    `,
      [
        faker.commerce.productName(),
        faker.commerce.productDescription(),
        faker.commerce.price({ min: 100, max: 20000, dec: 0 }),
      ]
    );
  }
}

setupDB();
