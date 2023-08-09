import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Register } from "./Register";
import { execQuery } from "../../db/execQuery";
import { testRender } from "../testRender";

describe("<Register>", () => {
  beforeEach(async () => {
    await execQuery(
      /* SQL */ `DELETE FROM users.users WHERE email_address = 'test-registered@example.org'`,
    );
  });

  it("Takes user registration", async () => {
    // Arrange
    const user = userEvent.setup();
    testRender(<Register />);

    // Act
    await user.type(screen.getByLabelText("Display Name"), "Test Displayname");
    await user.type(
      screen.getByLabelText("Email"),
      "test-registered@example.org",
    );
    await user.type(screen.getByLabelText("Password"), "testpassword");
    await user.type(screen.getByLabelText("Confirm Password"), "testpassword");

    await userEvent.click(screen.getByRole("button", { name: "Register" }));

    // Assert
    await waitFor(() => {
      screen.getByText(
        "Hello Test Displayname, your registration was successful!",
      );
      screen.getByText("Your email is test-registered@example.org.");

      expect(screen.queryByLabelText("Register")).toBeNull();
    });
  });

  describe("Display Name Input", () => {
    it("Hides error labels when fields filled out", async () => {
      // Like a user opening a web browser to /register
      testRender(<Register />);

      const displayNameInput =
        screen.getByLabelText<HTMLInputElement>("Display Name");

      // Like a user looking at the screen and seeing the initial error message
      expect(screen.getByText("Display name is required"));

      // Like a user typing into the display name input
      await userEvent.type(displayNameInput, "Test Name");

      // Like a user looking at the screen and seeing the error message disappear
      expect(screen.queryByText("Display name is required")).toBeNull();
    });
  });

  describe("Email Input", () => {
    it("Hides error labels when fields filled out", async () => {
      testRender(<Register />);
      const emailInput = screen.getByLabelText<HTMLInputElement>("Email");

      expect(screen.getByText("Email address is required"));

      await userEvent.type(emailInput, "test-registered@example.org");

      expect(screen.queryByText("Email address is required")).toBeNull();
    });

    it("Requires valid email address", async () => {
      testRender(<Register />);
      const emailInput = screen.getByLabelText<HTMLInputElement>("Email");

      await userEvent.type(emailInput, "test");

      expect(emailInput.validity.valid).toBe(false);
      expect(screen.getByText("Please enter a valid email address"));
    });
  });

  describe("Password Input", () => {
    it("Hides error labels when fields filled out", async () => {
      testRender(<Register />);
      const passwordInput = screen.getByLabelText<HTMLInputElement>("Password");

      expect(screen.getByText("Password is required"));

      await userEvent.type(passwordInput, "testpassword");

      expect(screen.queryByText("Password is required")).toBeNull();
    });
  });

  describe("Confirm Password Input", () => {
    it("Hides error labels when fields filled out", async () => {
      testRender(<Register />);
      const passwordConfirmInput =
        screen.getByLabelText<HTMLInputElement>("Confirm Password");

      expect(screen.getByText("Password confirmation is required"));

      await userEvent.type(passwordConfirmInput, "testpassword");

      expect(
        screen.queryByText("Password confirmation is required"),
      ).toBeNull();
    });

    it("Requires password confirmation to match password", async () => {
      testRender(<Register />);
      await userEvent.type(screen.getByLabelText("Password"), "testpassword");
      await userEvent.type(screen.getByLabelText("Confirm Password"), "test");
      const passwordConfirmInput =
        screen.getByLabelText<HTMLInputElement>("Confirm Password");

      expect(passwordConfirmInput.validity.valid).toBe(false);
      screen.getByText("Password confirmation must match password");
    });
  });
});
