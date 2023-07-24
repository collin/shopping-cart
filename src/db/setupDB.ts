import { execQuery } from "./execQuery";
import { createDB } from "./createDB";

export async function setupDB() {
  await createDB();

  // drop existing tables/schema
  await execQuery(/* SQL */ `
    DROP SCHEMA IF EXISTS store CASCADE;
  `);

  // create new tables/schema
  await execQuery(/* SQL */ `CREATE SCHEMA store`);
  // Table store.products {
  //   id bigserial [pk] // integer
  //   title text [not null]
  //   description text [not null]
  //   price integer [not null, default: 0, note: 'must be >= 0']
  // }

  // Table store.categories {
  //   id bigserial [pk]
  //   name text [not null]
  // }

  // Table store.products_categories {
  //   product_id bigint [pk, ref: > "store"."products"."id"]
  //   category_id bigint [pk, ref: > "store"."categories"."id"]
  // }

  await execQuery(/* SQL */ `
    CREATE TABLE store.products (
      id BIGSERIAL PRIMARY KEY, 
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      price INTEGER NOT NULL CHECK (price >= 0)
    );
    
    CREATE TABLE store.categories (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL
    );

    CREATE TABLE store.products_categories (
      product_id BIGINT REFERENCES store.products(id),
      category_id BIGINT REFERENCES store.categories(id),
      PRIMARY KEY (product_id, category_id)
    );
    `);
}
