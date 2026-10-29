import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const api = vi.hoisted(() => ({ editarRapidoProducto: vi.fn() }));

vi.mock("../src/services/api.js", () => api);

const { default: TablaProductos } = await import(
  "../src/components/admin/TablaProductos.jsx"
);

const productos = [
  {
    id: 1,
    codigo: "TAZ-001",
    slug: "taza-ceramica",
    nombre: "Taza de cerámica",
    categoria: { nombre: "Tazas y termos" },
    precio: "12000.00",
    stock: 8,
    destacado: true,
    activo: true,
    foto: { url: "/taza.webp", alt: "Taza estampada", generada_con_ia: true },
  },
  {
    id: 2,
    codigo: "REM-002",
    slug: "remera",
    nombre: "Remera",
    categoria: { nombre: "Indumentaria" },
    precio: "16000.00",
    stock: 0,
    destacado: false,
    activo: false,
    foto: null,
  },
];

beforeEach(() => api.editarRapidoProducto.mockReset());
afterEach(cleanup);

describe("TablaProductos", () => {
  it("muestra productos activos y ocultos con sus datos en tabla y tarjetas responsive", () => {
    render(<TablaProductos productos={productos} />);

    const tabla = screen.getByRole("table", { name: "Productos" });
    expect(within(tabla).getByText("Taza de cerámica")).toBeInTheDocument();
    expect(within(tabla).getByText("TAZ-001")).toBeInTheDocument();
    expect(within(tabla).getByText("Tazas y termos")).toBeInTheDocument();
    expect(within(tabla).getByText("Activo")).toBeInTheDocument();
    expect(within(tabla).getByText("Oculto")).toBeInTheDocument();
    expect(within(tabla).getByRole("img", { name: "Taza estampada" })).toHaveAttribute(
      "src",
      "/taza.webp",
    );
    expect(within(tabla).getByText("«Generado con IA»")).toBeInTheDocument();

    const tarjetas = screen.getByLabelText("Productos en tarjetas");
    expect(tarjetas).toHaveClass("md:hidden");
    expect(tarjetas).toHaveClass("flex", "flex-col");
    expect(screen.getByRole("table").parentElement).toHaveClass("hidden", "md:block");
  });

  it("guarda los cambios por producto y confirma el resultado", async () => {
    api.editarRapidoProducto.mockResolvedValue({});
    const usuario = userEvent.setup();
    render(<TablaProductos productos={productos} />);

    const tarjeta = screen.getByLabelText("Tarjeta de Taza de cerámica");
    await usuario.clear(within(tarjeta).getByLabelText("Precio"));
    await usuario.type(within(tarjeta).getByLabelText("Precio"), "12500");
    await usuario.clear(within(tarjeta).getByLabelText("Stock"));
    await usuario.type(within(tarjeta).getByLabelText("Stock"), "12");
    await usuario.click(within(tarjeta).getByLabelText("Destacado"));
    await usuario.click(within(tarjeta).getByRole("button", { name: "Guardar" }));

    expect(api.editarRapidoProducto).toHaveBeenCalledWith(1, {
      precio: 12500,
      stock: 12,
      destacado: false,
    });
    expect(await within(tarjeta).findByRole("status")).toHaveTextContent(
      "Cambios guardados.",
    );
  });

  it("mantiene los valores editados e informa el error si falla el guardado", async () => {
    api.editarRapidoProducto.mockImplementationOnce(() =>
      Promise.reject(new Error("Falló la API")),
    );
    const usuario = userEvent.setup();
    render(<TablaProductos productos={productos} />);

    const tarjeta = screen.getByLabelText("Tarjeta de Taza de cerámica");
    const precio = within(tarjeta).getByLabelText("Precio");
    await usuario.clear(precio);
    await usuario.type(precio, "13000");
    await usuario.click(within(tarjeta).getByRole("button", { name: "Guardar" }));

    expect(await within(tarjeta).findByRole("alert")).toHaveTextContent(
      "No pudimos guardar los cambios, probá de nuevo.",
    );
    expect(precio).toHaveValue(13000);
  });

  it("no convierte un precio vacío en cero ni envía una edición inválida", async () => {
    const usuario = userEvent.setup();
    render(<TablaProductos productos={productos} />);

    const tarjeta = screen.getByLabelText("Tarjeta de Taza de cerámica");
    await usuario.clear(within(tarjeta).getByLabelText("Precio"));
    await usuario.click(within(tarjeta).getByRole("button", { name: "Guardar" }));

    expect(await within(tarjeta).findByRole("alert")).toHaveTextContent(
      "Ingresá un precio y un stock válidos.",
    );
    expect(api.editarRapidoProducto).not.toHaveBeenCalled();
  });
});
