import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";

const api = vi.hoisted(() => ({
  obtenerProductosAdmin: vi.fn(),
  cambiarEstadoProducto: vi.fn(),
  editarRapidoProducto: vi.fn(),
}));

vi.mock("../src/services/api.js", () => api);

const { default: GestionProductos } = await import("../src/components/admin/GestionProductos.jsx");

const producto = (id, nombre, categoria, activo = true) => ({
  id,
  codigo: `${nombre.slice(0, 3).toUpperCase()}-00${id}`,
  slug: `p-${id}`,
  nombre,
  categoria: { nombre: categoria },
  precio: "1000.00",
  stock: 5,
  destacado: false,
  activo,
  foto: null,
});
const taza = producto(1, "Taza de cerámica", "Tazas y termos");
const remera = producto(2, "Remera", "Indumentaria", false);
const gorra = producto(3, "Gorra", "Indumentaria");

const MostrarRuta = () => <p data-testid="ruta">{useLocation().pathname}</p>;

const renderizar = (estado) =>
  render(
    <MemoryRouter initialEntries={[{ pathname: "/admin", state: estado }]}>
      <Routes>
        <Route path="/admin" element={<GestionProductos />} />
        <Route path="*" element={<MostrarRuta />} />
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => {
  Object.values(api).forEach((funcion) => funcion.mockReset());
  api.obtenerProductosAdmin.mockResolvedValue([taza, remera, gorra]);
});

afterEach(cleanup);

describe("GestionProductos", () => {
  it("B2-R1 · muestra «Nuevo producto» aunque todavía no haya productos y lleva a su pantalla", async () => {
    api.obtenerProductosAdmin.mockResolvedValue([]);
    const usuario = userEvent.setup();
    renderizar();

    expect(await screen.findByText("Todavía no hay productos cargados.")).toBeInTheDocument();
    await usuario.click(screen.getByRole("link", { name: "Nuevo producto" }));

    expect(screen.getByTestId("ruta")).toHaveTextContent("/admin/productos/nuevo");
  });

  it("B2-R4 · «Editar» abre la pantalla propia del producto", async () => {
    const usuario = userEvent.setup();
    renderizar();

    const tabla = await screen.findByRole("table", { name: "Productos" });
    await usuario.click(within(tabla).getByRole("button", { name: "Editar Taza de cerámica" }));

    expect(screen.getByTestId("ruta")).toHaveTextContent("/admin/productos/1");
  });

  it("muestra el aviso que deja la pantalla de edición al volver", async () => {
    renderizar({ aviso: { tipo: "status", texto: "Producto actualizado." } });

    expect(await screen.findByRole("status")).toHaveTextContent("Producto actualizado.");
  });

  it("busca por nombre sin importar tildes ni mayúsculas", async () => {
    const usuario = userEvent.setup();
    renderizar();

    await usuario.type(await screen.findByLabelText("Buscar por nombre o código"), "CERAMICA");

    const tabla = screen.getByRole("table", { name: "Productos" });
    expect(within(tabla).getByText("Taza de cerámica")).toBeInTheDocument();
    expect(within(tabla).queryByText("Gorra")).not.toBeInTheDocument();
    expect(screen.getByText("Mostrando 1 de 3 productos")).toBeInTheDocument();
  });

  it("filtra por categoría y por estado", async () => {
    const usuario = userEvent.setup();
    renderizar();

    await usuario.selectOptions(await screen.findByLabelText("Categoría"), "Indumentaria");
    await usuario.selectOptions(screen.getByLabelText("Estado"), "ocultos");

    const tabla = screen.getByRole("table", { name: "Productos" });
    expect(within(tabla).getByText("Remera")).toBeInTheDocument();
    expect(within(tabla).queryByText("Gorra")).not.toBeInTheDocument();
    expect(within(tabla).queryByText("Taza de cerámica")).not.toBeInTheDocument();
  });

  it("avisa cuando ningún producto coincide con la búsqueda", async () => {
    const usuario = userEvent.setup();
    renderizar();

    await usuario.type(await screen.findByLabelText("Buscar por nombre o código"), "zapatilla");

    expect(screen.getByText("No hay productos que coincidan con la búsqueda.")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("B2-R5 · oculta un producto activo sin borrarlo y vuelve a pedir la lista", async () => {
    api.cambiarEstadoProducto.mockResolvedValue({ ...taza, activo: false });
    const usuario = userEvent.setup();
    renderizar();

    const tabla = await screen.findByRole("table", { name: "Productos" });
    await usuario.click(within(tabla).getByRole("button", { name: "Ocultar Taza de cerámica" }));

    expect(api.cambiarEstadoProducto).toHaveBeenCalledWith(1, false);
    expect(await screen.findByRole("status")).toHaveTextContent("ya no se ve en la tienda");
    expect(api.obtenerProductosAdmin).toHaveBeenCalledTimes(2);
  });

  it("B2-R5 · vuelve a mostrar un producto oculto", async () => {
    api.cambiarEstadoProducto.mockResolvedValue(remera);
    const usuario = userEvent.setup();
    renderizar();

    const tabla = await screen.findByRole("table", { name: "Productos" });
    await usuario.click(within(tabla).getByRole("button", { name: "Mostrar Remera" }));

    expect(api.cambiarEstadoProducto).toHaveBeenCalledWith(2, true);
  });

  it("avisa si no pudo cambiar el estado", async () => {
    api.cambiarEstadoProducto.mockRejectedValue(new Error("Falló la API"));
    const usuario = userEvent.setup();
    renderizar();

    const tabla = await screen.findByRole("table", { name: "Productos" });
    await usuario.click(within(tabla).getByRole("button", { name: "Ocultar Taza de cerámica" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No pudimos cambiar el estado del producto, probá de nuevo.",
    );
  });
});
