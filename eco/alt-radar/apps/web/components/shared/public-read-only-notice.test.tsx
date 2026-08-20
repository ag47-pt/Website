import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PublicReadOnlyNotice } from "./public-read-only-notice";

describe("PublicReadOnlyNotice", () => {
  it("identifies the public portal as read-only", () => {
    render(<PublicReadOnlyNotice />);

    expect(screen.getByRole("status", { name: "Modo de acesso público" })).toHaveTextContent(
      "Portal público · somente leitura",
    );
    expect(screen.getByText(/Alterações exigem acesso autenticado de operador/i)).toBeVisible();
  });
});
