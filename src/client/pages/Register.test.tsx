import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Register } from "./Register";
import { execQuery } from "../../db/execQuery";

describe("<Register>", () => {
  beforeEach(async () => {
    await execQuery(
      /* SQL */ `DELETE FROM users.users WHERE email_address = 'test@example.org'`,
    );
  });

  it("Takes user registration", async () => {
    const user = userEvent.setup();
    render(<Register />);
    await user.type(screen.getByLabelText("Display Name"), "Test Displayname");
    await user.type(screen.getByLabelText("Email"), "test@example.org");
    await user.type(screen.getByLabelText("Password"), "testpassword");
    await user.type(screen.getByLabelText("Confirm Password"), "testpassword");

    await userEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      screen.getByText(
        "Hello Test Displayname, your registration was successful!",
      );
      screen.getByText("Your email is test@example.org.");
    });
  });
});
