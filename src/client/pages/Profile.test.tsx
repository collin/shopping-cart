import { waitFor, screen } from "@testing-library/react";
import { testRender } from "../testRender";
import { Profile } from "./Profile";
import { loginAsUserId } from "../loginAsUserId";

export const JWT_SESSION_SECRET = process.env.JWT_SESSION_SECRET!;

describe("<Profile>", () => {
  describe("when the user is logged in", () => {
    it("renders the user's name", async () => {
      loginAsUserId(1);
      testRender(<Profile />);

      await waitFor(() => {
        screen.getByText("Hello Test User");
      });
    });
  });
});
