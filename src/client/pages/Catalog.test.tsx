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
      </MemoryRouter>,
    );

    await waitFor(() => {
      screen.getByText("Product 1");
      screen.getByText("Product 2");
      screen.getByText("Product 3");
      screen.getByText("Product 4");
    });
  });

  it.only("renders the page size of products", async () => {
    render(
      <MemoryRouter initialEntries={["/?pageSize=2"]}>
        <Catalog />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getAllByRole("listitem")).toHaveLength(2);
    });
  });

  it("renders the requested page of products", async () => {
    render(
      <MemoryRouter initialEntries={["/?pageSize=2&page=2"]}>
        <Catalog />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getAllByRole("listitem")).toHaveLength(2);
      screen.getByText("Product 3");
      screen.getByText("Product 4");
    });
  });

  describe("Page controls", () => {
    it("renders the next page of products when requested", async () => {
      render(
        <MemoryRouter initialEntries={["/?pageSize=2"]}>
          <Catalog />
        </MemoryRouter>,
      );

      await waitFor(() => {
        screen.getByRole("button", { name: "Next" }).click();
      });

      await waitFor(() => {
        expect(screen.getAllByRole("listitem")).toHaveLength(2);
        screen.getByText("Product 3");
        screen.getByText("Product 4");
      });
    });

    it("renders the previous page of products when requested", async () => {
      render(
        <MemoryRouter initialEntries={["/?pageSize=2&page=2"]}>
          <Catalog />
        </MemoryRouter>,
      );

      await waitFor(() => {
        screen.getByRole("button", { name: "Previous" }).click();
      });

      await waitFor(() => {
        expect(screen.getAllByRole("listitem")).toHaveLength(2);
        screen.getByText("Product 1");
        screen.getByText("Product 2");
      });
    });

    it("hides the previous page button on the first page", async () => {
      render(
        <MemoryRouter initialEntries={["/?page=1"]}>
          <Catalog />
        </MemoryRouter>,
      );

      await waitFor(async () => {
        screen.getByRole("button", { name: "Next" });
        expect(screen.queryByRole("button", { name: "Previous" })).toBeNull();
      });
    });

    it("shows the next page button on pages after the first", async () => {
      render(
        <MemoryRouter initialEntries={["/?page=2"]}>
          <Catalog />
        </MemoryRouter>,
      );

      await waitFor(async () => {
        screen.getByRole("button", { name: "Previous" });
        screen.getByRole("button", { name: "Next" });
      });
    });
  });
});

// go to next page
// go to prev page
// go to first page
// go to last page (????)

// /catalog?page=1&size=5

// disallow negative pages page -1
// disallow negative page size size -1
// maximum page size
