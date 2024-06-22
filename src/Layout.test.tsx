import { test, expect, describe, beforeEach } from "vitest";
import { userEvent } from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { Layout } from "./Layout";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

describe("Layout", () => {
  beforeEach(() => {
    const router = createBrowserRouter([
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            path: "/",
            element: <div>Home</div>,
          },
        ],
      },
    ]);

    render(<RouterProvider router={router} />);
  });

  test("renders a link to the landing page", () => {
    expect(screen.getByRole("link", { name: "FortyMM" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  test("does not show the mobile menu", () => {
    expect(
      screen.queryByRole("button", { name: "Close" }),
    ).not.toBeInTheDocument();
  });

  test("shows the mobile menu when it is toggled", async () => {
    expect(
      screen.queryByRole("button", { name: "Close" }),
    ).not.toBeInTheDocument();
    userEvent.click(
      screen.getByRole("button", { name: "Toggle navigation menu" }),
    );
    await screen.findByRole("button", { name: "Close" });
  });

  describe("the mobile menu", () => {
    beforeEach(async () => {
      userEvent.click(
        screen.getByRole("button", { name: "Toggle navigation menu" }),
      );
      await screen.findByRole("button", { name: "Close" });
    });

    test("shows a link to the landing page", () => {
      expect(screen.getByRole("link", { name: "FortyMM" })).toBeInTheDocument();
    });
  });
});
