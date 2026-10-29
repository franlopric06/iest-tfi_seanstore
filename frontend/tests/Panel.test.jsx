import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import Panel from "../src/pages/admin/Panel.jsx";

afterEach(cleanup);

describe("Panel", () => {
  it("muestra el título y evita la indexación", async () => {
    render(<Panel />);

    expect(
      await screen.findByRole("heading", { level: 1, name: "Panel de administración" }),
    ).toBeInTheDocument();
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );
  });

  it("presenta las dos pestañas accesibles y permite cambiar de sección", async () => {
    const usuario = userEvent.setup();
    render(<Panel />);

    const productos = screen.getByRole("tab", { name: "Productos" });
    const taller = screen.getByRole("tab", { name: "Nuestro taller" });
    expect(screen.getByRole("tablist")).toContainElement(productos);
    expect(productos).toHaveAttribute("aria-selected", "true");
    expect(productos).toHaveClass("border-violeta");
    expect(taller).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tabpanel")).toHaveAttribute("aria-labelledby", productos.id);

    await usuario.click(taller);

    expect(taller).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveAttribute("aria-labelledby", taller.id);
  });

  it("cambia de pestaña con las flechas del teclado", async () => {
    const usuario = userEvent.setup();
    render(<Panel />);

    const productos = screen.getByRole("tab", { name: "Productos" });
    const taller = screen.getByRole("tab", { name: "Nuestro taller" });
    productos.focus();
    await usuario.keyboard("{ArrowRight}");

    expect(taller).toHaveFocus();
    expect(taller).toHaveAttribute("aria-selected", "true");
  });
});
