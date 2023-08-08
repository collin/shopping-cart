import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Login } from "./Login";

describe("<Login>", () => {
  it("Logs in a user", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<Login />);

    // Act
    await userEvent.type(
      screen.getByLabelText("Email"),
      "test-user@example.org",
    );
    await userEvent.type(screen.getByLabelText("Password"), "testpassword");

    await userEvent.click(screen.getByRole("button", { name: "Login" }));

    // Assert
    await waitFor(() => {
      screen.getByText("Logged in as Test User");
      screen.getByText("Your email is test-user@example.org.");
      expect(screen.queryByLabelText("Login")).toBeNull();
    });
  });

  describe("Email field", () => {
    it("Hides error labels when fields filled out", async () => {
      // Like a user opening a web browser to /login
      render(<Login />);

      const emailInput = screen.getByLabelText<HTMLInputElement>("Email");

      // Like a user looking at the screen and seeing the initial error message
      expect(screen.getByText("Email is required"));

      // Like a user typing into the email input
      await userEvent.type(emailInput, "test-user@example.org");

      // Like a user looking at the screen and seeing the error message disappear
      expect(screen.queryByText("Email is required")).toBeNull();
    });

    it("Requires valid email address", async () => {
      render(<Login />);
      const emailInput = screen.getByLabelText<HTMLInputElement>("Email");

      expect(screen.getByText("Email is required"));

      await userEvent.type(emailInput, "test-user@example.org");

      expect(
        screen.queryByText("Please enter a valid email address"),
      ).toBeNull();
    });
  });

  describe("Password field", () => {
    it("Hides error labels when fields filled out", async () => {
      render(<Login />);
      const passwordInput = screen.getByLabelText<HTMLInputElement>("Password");

      expect(screen.getByText("Password is required"));

      await userEvent.type(passwordInput, "testpassword");

      expect(screen.queryByText("Password is required")).toBeNull();
    });
  });
});
