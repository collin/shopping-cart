import { faker } from "@faker-js/faker";
import { execQuery } from "./execQuery";

const SEED_PRODUCT_COUNT = parseInt(process.env.SEED_PRODUCT_COUNT || "100");
const SEED_CATEGORY_COUNT = parseInt(process.env.SEED_CATEGORY_COUNT || "10");

export async function seedDB() {
  // create initial fake category data
  for (let i = 0; i < SEED_CATEGORY_COUNT; i++) {
    await execQuery(
      /* SQL */ `
      INSERT INTO store.categories (name)
      VALUES ($1)
    `,
      [faker.commerce.department()],
    );
  }

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
      ],
    );

    // create initial fake product-category data
    await execQuery(
      /* SQL */ `
      INSERT INTO store.products_categories (product_id, category_id)
      VALUES ($1, $2)
    `,
      [i + 1, faker.number.int({ min: 1, max: SEED_CATEGORY_COUNT })],
    );
  }
}
