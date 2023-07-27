import { render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Catalog } from "./Catalog";

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
        screen.getByRole("link", { name: "Next" }).click();
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
        screen.getByRole("link", { name: "Previous" }).click();
      });

      await waitFor(() => {
        expect(
          within(screen.getByTitle("Products")).getAllByRole("listitem"),
        ).toHaveLength(2);
        screen.getByText("Product 1");
        screen.getByText("Product 2");
      });
    });

    it("hides the previous page link on the first page", async () => {
      render(
        <MemoryRouter initialEntries={["/?page=1"]}>
          <Catalog />
        </MemoryRouter>,
      );

      await waitFor(async () => {
        screen.getByRole("link", { name: "Next" });
        expect(screen.queryByRole("link", { name: "Previous" })).toBeNull();
      });
    });

    it("shows the next page link on pages after the first", async () => {
      render(
        <MemoryRouter initialEntries={["/?page=2"]}>
          <Catalog />
        </MemoryRouter>,
      );

      await waitFor(async () => {
        screen.getByRole("link", { name: "Previous" });
        screen.getByRole("link", { name: "Next" });
      });
    });

    describe("First page controls", () => {
      it("hides the first page link on the first page", async () => {
        render(
          <MemoryRouter initialEntries={["/?page=1"]}>
            <Catalog />
          </MemoryRouter>,
        );

        await waitFor(async () => {
          expect(screen.queryByRole("link", { name: "First" })).toBeNull();
        });
      });

      it("hides the first page link on the second page", async () => {
        render(
          <MemoryRouter initialEntries={["/?page=2"]}>
            <Catalog />
          </MemoryRouter>,
        );

        await waitFor(async () => {
          expect(screen.queryByRole("link", { name: "First" })).toBeNull();
        });
      });

      it("shows the first page link on pages after the second", async () => {
        render(
          <MemoryRouter initialEntries={["/?page=3"]}>
            <Catalog />
          </MemoryRouter>,
        );

        await waitFor(async () => {
          screen.getByRole("link", { name: "First" });
        });
      });

      it("goes to the first page when the first page link is clicked", async () => {
        render(
          <MemoryRouter initialEntries={["/?page=3"]}>
            <Catalog />
          </MemoryRouter>,
        );

        await waitFor(async () => {
          screen.getByRole("link", { name: "First" }).click();
        });

        await waitFor(async () => {
          expect(screen.queryByRole("link", { name: "Previous" })).toBeNull();
          screen.getByRole("link", { name: "Next" });
        });
      });

      it("retains the categoryId when switching pages", async () => {
        render(
          <MemoryRouter initialEntries={["/?categoryId=1&page=3"]}>
            <Catalog />
          </MemoryRouter>,
        );

        await waitFor(async () => {
          screen.getByRole("link", { name: "First" }).click();
        });

        await waitFor(async () => {
          screen.getByText("Viewing Category 1");
        });
      });
    });
  });
});
