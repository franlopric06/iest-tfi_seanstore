import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const api = vi.hoisted(() => ({
  obtenerProductosAdmin: vi.fn(),
  obtenerTaller: vi.fn(),
  guardarTextoTaller: vi.fn(),
}));

vi.mock("../src/services/api.js", () => api);

import Panel from "../src/pages/admin/Panel.jsx";

const contenidoTaller = {
  titulo: "Nuestro taller",
  parrafo: "Cada pedido se diseña y se estampa en nuestro taller de Tinogasta.",
  fotos: [],
};

afterEach(cleanup);
beforeEach(() => {
  api.obtenerProductosAdmin.mockResolvedValue([]);
  api.obtenerTaller.mockResolvedValue(contenidoTaller);
});

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

  it("muestra carga y estado vacío de los productos administrativos", async () => {
    api.obtenerProductosAdmin.mockReturnValue(new Promise(() => {}));
    const { unmount } = render(<Panel />);

    expect(screen.getByRole("status", { name: "Cargando productos del panel" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
    unmount();

    api.obtenerProductosAdmin.mockResolvedValue([]);
    render(<Panel />);
    expect(await screen.findByText("Todavía no hay productos cargados.")).toBeInTheDocument();
  });

  it("muestra un error de carga y permite volver a pedir los productos", async () => {
    api.obtenerProductosAdmin
      .mockRejectedValueOnce(new Error("Falló la API"))
      .mockResolvedValueOnce([]);
    const usuario = userEvent.setup();
    render(<Panel />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Algo salió mal, probá de nuevo",
    );
    await usuario.click(screen.getByRole("button", { name: "Reintentar" }));

    expect(await screen.findByText("Todavía no hay productos cargados.")).toBeInTheDocument();
    expect(api.obtenerProductosAdmin).toHaveBeenCalledTimes(2);
  });

  it("muestra el editor del taller dentro de su pestaña", async () => {
    const usuario = userEvent.setup();
    render(<Panel />);

    await usuario.click(screen.getByRole("tab", { name: "Nuestro taller" }));

    expect(
      await screen.findByRole("heading", { name: "Editá el texto de Nuestro taller" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Título")).toHaveValue("Nuestro taller");
    expect(
      screen.getByLabelText("Párrafo"),
    ).toHaveValue("Cada pedido se diseña y se estampa en nuestro taller de Tinogasta.");
    expect(api.obtenerTaller).toHaveBeenCalled();
  });
});
