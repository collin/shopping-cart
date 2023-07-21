import { render, screen } from "@testing-library/react";
import App from "./App";
import { MemoryRouter } from "react-router-dom";

describe("Home route: /", () => {
  it("renders the home page", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    screen.getByText("Homepage");
  });
});

describe("Catalog route: /catalog", () => {
  it("renders the catalog page", () => {
    render(
      <MemoryRouter initialEntries={["/catalog"]}>
        <App />
      </MemoryRouter>
    );

    screen.getByText("Catalogpage");
  });
});
