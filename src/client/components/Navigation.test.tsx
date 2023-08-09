import { screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Navigation } from "./Navigation";
import { testRender } from "../testRender";
import { loginAsUserId } from "../loginAsUserId";

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

  it("renders a link to the login page", () => {
    testRender(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>,
    );

    screen.getByRole("link", { name: "Login" });
  });

  describe("when logged in", () => {
    it("does not render a link to the registration page", async () => {
      loginAsUserId(1);
      testRender(
        <MemoryRouter>
          <Navigation />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.queryByRole("link", { name: "Register" })).toBeNull();
      });
    });

    it("does not render a link to the login page", async () => {
      loginAsUserId(1);
      testRender(
        <MemoryRouter>
          <Navigation />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.queryByRole("link", { name: "Login" })).toBeNull();
      });
    });

    it("renders a link to the profile page", async () => {
      loginAsUserId(1);
      testRender(
        <MemoryRouter>
          <Navigation />
        </MemoryRouter>,
      );

      await waitFor(() => {
        screen.getByRole("link", { name: "Profile" });
      });
    });

    it("renders a logout button", async () => {
      loginAsUserId(1);
      testRender(
        <MemoryRouter>
          <Navigation />
        </MemoryRouter>,
      );

      await waitFor(() => {
        screen.getByRole("button", { name: "Logout" });
      });
    });
  });
});
