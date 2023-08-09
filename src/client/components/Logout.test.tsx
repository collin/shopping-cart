import { vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { testRender } from "../testRender";
import { Logout } from "./Logout";
import { Profile } from "../pages/Profile";
import { loginAsUserId } from "../loginAsUserId";

describe("<Logout", () => {
  it("logs the user out", async () => {
    const originalLocation = window.location;
    const mockReload = vi.fn();

    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...originalLocation, reload: mockReload },
    });

    loginAsUserId(1);
    testRender(
      <>
        <Profile />
        <Logout />
      </>,
    );

    await screen.findByText("Hello Test User");

    screen.getByText("Logout").click();

    await waitFor(() => {
      expect(screen.queryByText("Hello Test User")).toBeNull();
    });

    expect(mockReload).toHaveBeenCalledOnce();

    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });
});
