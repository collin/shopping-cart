import { screen, waitFor } from "@testing-library/react";
import App from "./App";
import { MemoryRouter, Router, createMemoryRouter } from "react-router-dom";
import { testRender } from "./testRender";
import { loginAsUserId } from "./loginAsUserId";

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

describe("Register route: /register", () => {
  describe("when the user is logged in", () => {
    it("redirects to the profile page", async () => {
      loginAsUserId(1);

      testRender(
        <MemoryRouter initialEntries={["/register"]}>
          <App />
        </MemoryRouter>,
      );

      await waitFor(() => {
        screen.getByText("Hello Test User");
      });
    });
  });

  it("renders the register page", () => {
    testRender(
      <MemoryRouter initialEntries={["/register"]}>
        <App />
      </MemoryRouter>,
    );

    screen.getByRole("heading", { name: "Register" });
  });
});

describe("Profile route: /profile", () => {
  describe("when the user is logged in", () => {
    it("renders the profile page", async () => {
      loginAsUserId(1);

      testRender(
        <MemoryRouter initialEntries={["/profile"]}>
          <App />
        </MemoryRouter>,
      );

      await waitFor(() => {
        screen.getByText("Hello Test User");
      });
    });
  });

  describe("when the user is not logged in", () => {
    it("redirects to the login page", async () => {
      testRender(
        <MemoryRouter initialEntries={["/profile"]}>
          <App />
        </MemoryRouter>,
      );

      await waitFor(() => {
        screen.getByRole("heading", { name: "Login" });
      });
    });
  });
});

describe("Login route: /login", () => {
  describe("when the user is logged in", () => {
    it("redirects to the profile page", async () => {
      loginAsUserId(1);

      testRender(
        <MemoryRouter initialEntries={["/login"]}>
          <App />
        </MemoryRouter>,
      );

      await waitFor(() => {
        screen.getByText("Hello Test User");
      });
    });
  });

  it("renders the login page", () => {
    testRender(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>,
    );

    screen.getByRole("heading", { name: "Login" });
  });
});
