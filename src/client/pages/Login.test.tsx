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
});
