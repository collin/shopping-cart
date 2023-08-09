import { render, screen } from "@testing-library/react";
import App from "./App";
import { MemoryRouter } from "react-router-dom";
import { testRender } from "./testRender";

describe("Home route: /", () => {
  it("renders the home page", () => {
    testRender(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    screen.getByText("Homepage");
  });
});

describe("Catalog route: /catalog", () => {
  it("renders the catalog page", () => {
    testRender(
      <MemoryRouter initialEntries={["/catalog"]}>
        <App />
      </MemoryRouter>,
    );

    screen.getByText("Catalogpage");
  });
});
