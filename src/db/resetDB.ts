import { faker } from "@faker-js/faker";
import { execQuery } from "./execQuery";
import { setupDB } from "./setupDB";

const SEED_PRODUCT_COUNT = parseInt(process.env.SEED_PRODUCT_COUNT || "100");

async function seedDB() {
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

async function resetDB() {
  await setupDB();
  await seedDB();
}

resetDB();
