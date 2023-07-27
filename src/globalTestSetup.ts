import { execQuery } from "./db/execQuery";
import { setupDB } from "./db/setupDB";

export default async () => {
  process.env.DATABASE_URL =
    "postgres://postgres:postgres@localhost:5432/shopping-cart-test";
  const TEST_PORT = 3000;

  await setupDB();
  await execQuery(/* SQL */ `
        insert into store.products (title, description, price)
        values
          ('Product 1', 'Description 1', 100),
          ('Product 2', 'Description 2', 200),
          ('Product 3', 'Description 3', 300),
          ('Product 4', 'Description 4', 300)
      `);
  await execQuery(/* SQL */ `
        insert into store.categories (name)
        values
          ('Category 1'),
          ('Category 2'),
          ('Category 3'),
          ('Category 4')
      `);
  await execQuery(/* SQL */ `
        insert into store.products_categories (product_id, category_id)
        values
          (1, 1),
          (2, 2),
          (3, 3),
          (4, 4)
      `);
};
