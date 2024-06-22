import { test, expect, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  test("renders the title", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: "Vite + React" }),
    ).toBeInTheDocument();
  });
});
