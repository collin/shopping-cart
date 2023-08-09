import { execQuery } from "./execQuery";
import { createDB } from "./createDB";

export async function setupDB() {
  await createDB();

  // drop existing tables/schema
  await execQuery(/* SQL */ `
    DROP SCHEMA IF EXISTS store CASCADE;
    CREATE SCHEMA store;

    DROP SCHEMA IF EXISTS users CASCADE;
    CREATE SCHEMA users;
  `);

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

  // Table user.users {
  //   id bigserial [pk]
  //   display_name string [not null]
  //   email_address string [not null, unique]
  //   salt byte [not null]
  //   hashed_password bytea [not null]
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

    CREATE TABLE users.users (
      id BIGSERIAL PRIMARY KEY,
      display_name TEXT NOT NULL,
      email_address TEXT NOT NULL UNIQUE,
      hashed_password BYTEA NOT NULL,
      salt BYTEA NOT NULL
    );
    `);
}
