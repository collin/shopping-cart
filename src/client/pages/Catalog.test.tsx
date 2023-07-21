import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Catalog } from "./Catalog";

import { app } from "../../server/app";
import { setupDB } from "../../db/setupDB";
import { execQuery } from "../../db/execQuery";

const TEST_PORT = 3000;

beforeAll(async () => {
  await setupDB();
  await execQuery(/* SQL */ `
    insert into store.products (title, description, price)
    values
      ('Product 1', 'Description 1', 100),
      ('Product 2', 'Description 2', 200),
      ('Product 3', 'Description 3', 300),
      ('Product 4', 'Description 4', 300)
  `);
});

beforeAll(() => {
  return new Promise((resolve) => {
    app.listen(TEST_PORT, () => {
      console.log(`Test server listening at http://localhost:${TEST_PORT}`);
      resolve();
    });
  });
});

describe("<Catalog />", () => {
  it("renders all products in the catalog", async () => {
    render(
      <MemoryRouter>
        <Catalog />
      </MemoryRouter>
    );

    await waitFor(() => {
      screen.getByText("Product 1");
      screen.getByText("Product 2");
      screen.getByText("Product 3");
      screen.getByText("Product 4");
    });
  });
});
