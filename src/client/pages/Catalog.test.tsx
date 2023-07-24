import { render, screen, waitFor, within } from "@testing-library/react";
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
  describe("Categories", () => {
    it("Renders all categories in the catalog", async () => {
      render(
        <MemoryRouter>
          <Catalog />
        </MemoryRouter>,
      );

      await waitFor(() => {
        screen.getByText("Category 1");
        screen.getByText("Category 2");
        screen.getByText("Category 3");
        screen.getByText("Category 4");
      });
    });

    it("Indicates which category is currently viewed", async () => {
      render(
        <MemoryRouter initialEntries={["/?categoryId=1"]}>
          <Catalog />
        </MemoryRouter>,
      );

      await waitFor(() => {
        screen.getByText("Viewing Category 1");
      });
    });

    it("Renders the products in the selected category", async () => {
      render(
        <MemoryRouter initialEntries={["/?categoryId=1"]}>
          <Catalog />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(
          screen.getByTitle("Products").querySelectorAll("li"),
        ).toHaveLength(1);
        screen.getByText("Product 1");
      });
    });

    it("Navigates to the selected category when clicked", async () => {
      render(
        <MemoryRouter>
          <Catalog />
        </MemoryRouter>,
      );

      await waitFor(() => {
        screen.getByText("Category 1").click();
      });

      await waitFor(() => {
        expect(
          screen.getByTitle("Products").querySelectorAll("li"),
        ).toHaveLength(1);
        screen.getByText("Product 1");
      });
    });
  });

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

  it("renders the page size of products", async () => {
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
        expect(
          within(screen.getByTitle("Products")).getAllByRole("listitem"),
        ).toHaveLength(2);
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
        expect(
          within(screen.getByTitle("Products")).getAllByRole("listitem"),
        ).toHaveLength(2);
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

    describe("First page controls", () => {
      it("hides the first page button on the first page", async () => {
        render(
          <MemoryRouter initialEntries={["/?page=1"]}>
            <Catalog />
          </MemoryRouter>,
        );

        await waitFor(async () => {
          expect(screen.queryByRole("button", { name: "First" })).toBeNull();
        });
      });

      it("hides the first page button on the second page", async () => {
        render(
          <MemoryRouter initialEntries={["/?page=2"]}>
            <Catalog />
          </MemoryRouter>,
        );

        await waitFor(async () => {
          expect(screen.queryByRole("button", { name: "First" })).toBeNull();
        });
      });

      it("shows the first page button on pages after the second", async () => {
        render(
          <MemoryRouter initialEntries={["/?page=3"]}>
            <Catalog />
          </MemoryRouter>,
        );

        await waitFor(async () => {
          screen.getByRole("button", { name: "First" });
        });
      });

      it("goes to the first page when the first page button is clicked", async () => {
        render(
          <MemoryRouter initialEntries={["/?page=3"]}>
            <Catalog />
          </MemoryRouter>,
        );

        await waitFor(async () => {
          screen.getByRole("button", { name: "First" }).click();
        });

        await waitFor(async () => {
          expect(screen.queryByRole("button", { name: "Previous" })).toBeNull();
          screen.getByRole("button", { name: "Next" });
        });
      });

      it("retains the categoryId when switching pages", async () => {
        render(
          <MemoryRouter initialEntries={["/?categoryId=1&page=3"]}>
            <Catalog />
          </MemoryRouter>,
        );

        await waitFor(async () => {
          screen.getByRole("button", { name: "First" }).click();
        });

        await waitFor(async () => {
          screen.getByText("Viewing Category 1");
        });
      });
    });
  });
});
