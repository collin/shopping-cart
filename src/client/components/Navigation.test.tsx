import { screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Navigation } from "./Navigation";
import { testRender } from "../testRender";

describe("Navigation links", () => {
  it("renders a link to the home page", () => {
    testRender(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>,
    );

    screen.getByRole("link", { name: "Home" });
  });

  it("renders a link to the catalog page", () => {
    testRender(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>,
    );

    screen.getByRole("link", { name: "Catalog" });
  });

  it("renders a link to the registration page", () => {
    testRender(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>,
    );

    screen.getByRole("link", { name: "Register" });
  });
});
