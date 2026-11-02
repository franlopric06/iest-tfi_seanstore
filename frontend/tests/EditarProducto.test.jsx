import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";

const api = vi.hoisted(() => ({
  obtenerProductoAdmin: vi.fn(),
  obtenerCategorias: vi.fn(),
  crearProducto: vi.fn(),
  editarProducto: vi.fn(),
  obtenerFotosProducto: vi.fn(),
}));

vi.mock("../src/services/api.js", () => api);

const { default: EditarProducto } = await import("../src/pages/admin/EditarProducto.jsx");

const taza = {
  id: 1,
  codigo: "TAZ-001",
  nombre: "Taza de cerámica",
  categoria_id: 1,
  precio: "12000.00",
  stock: 8,
  descripcion: "Taza de 325 ml.",
  talles: [],
  colores: ["Blanco", "Negro"],
  destacado: true,
  activo: true,
};

// Muestra la lista con el aviso que le deja la pantalla de edición.
const ListaFalsa = () => <p data-testid="lista">{useLocation().state?.aviso?.texto ?? "lista"}</p>;

const renderizar = (ruta) =>
  render(
    <MemoryRouter initialEntries={["/admin", ruta]} initialIndex={1}>
      <Routes>
        <Route path="/admin" element={<ListaFalsa />} />
        <Route path="/admin/productos/:id" element={<EditarProducto />} />
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => {
  Object.values(api).forEach((funcion) => funcion.mockReset());
  api.obtenerProductoAdmin.mockResolvedValue(taza);
  api.obtenerCategorias.mockResolvedValue([{ id: 1, nombre: "Tazas y termos" }]);
  api.obtenerFotosProducto.mockResolvedValue([]);
});

afterEach(cleanup);

const completarAlta = async (usuario) => {
  const zona = await screen.findByRole("region", { name: "Agregar producto" });
  await within(zona).findByRole("option", { name: "Tazas y termos" });
  await usuario.type(within(zona).getByLabelText("Nombre"), "Llavero");
  await usuario.selectOptions(within(zona).getByLabelText("Categoría"), "1");
  await usuario.type(within(zona).getByLabelText("Precio"), "3500");
  await usuario.type(within(zona).getByLabelText("Stock"), "20");
  await usuario.type(within(zona).getByLabelText("Colores"), "Blanco");
  return zona;
};

describe("EditarProducto", () => {
  it("tiene un enlace para volver a la lista de productos", async () => {
    renderizar("/admin/productos/1");

    expect(await screen.findByRole("link", { name: "Volver a productos" })).toHaveAttribute("href", "/admin");
  });

  it("B2-R4 · carga el producto, muestra sus fotos y deja Guardar debajo de ellas", async () => {
    renderizar("/admin/productos/1");

    const zona = await screen.findByRole("region", { name: "Editar producto" });
    expect(within(zona).getByLabelText("Nombre")).toHaveValue("Taza de cerámica");
    expect(api.obtenerProductoAdmin).toHaveBeenCalledWith("1");
    const fotos = await within(zona).findByRole("heading", { name: /Fotos del producto/ });
    const guardar = within(zona).getByRole("button", { name: "Guardar" });
    expect(fotos.compareDocumentPosition(guardar) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("B2-R4 · guarda los cambios y vuelve a la lista con el aviso", async () => {
    api.editarProducto.mockResolvedValue(taza);
    const usuario = userEvent.setup();
    renderizar("/admin/productos/1");

    const zona = await screen.findByRole("region", { name: "Editar producto" });
    await within(zona).findByRole("option", { name: "Tazas y termos" });
    await usuario.click(within(zona).getByRole("button", { name: "Guardar" }));

    expect(api.editarProducto).toHaveBeenCalledWith(1, expect.objectContaining({ nombre: "Taza de cerámica" }));
    expect(await screen.findByTestId("lista")).toHaveTextContent("Producto actualizado.");
  });

  it("B2-R1 · crea el producto y abre su pantalla para agregarle fotos", async () => {
    api.crearProducto.mockResolvedValue({ id: 7, nombre: "Llavero" });
    api.obtenerProductoAdmin.mockResolvedValue({ ...taza, id: 7, nombre: "Llavero" });
    const usuario = userEvent.setup();
    renderizar("/admin/productos/nuevo");

    const zona = await completarAlta(usuario);
    expect(api.obtenerProductoAdmin).not.toHaveBeenCalled();
    await usuario.click(within(zona).getByRole("button", { name: "Guardar" }));

    expect(await screen.findByRole("status")).toHaveTextContent("Producto creado. Ahora podés agregarle fotos.");
    expect(await screen.findByRole("region", { name: "Editar producto" })).toBeInTheDocument();
    expect(api.obtenerProductoAdmin).toHaveBeenCalledWith("7");
    expect(await screen.findByText("Este producto todavía no tiene fotos.")).toBeInTheDocument();
  });

  it("cancelar vuelve a la lista sin guardar", async () => {
    const usuario = userEvent.setup();
    renderizar("/admin/productos/1");

    const zona = await screen.findByRole("region", { name: "Editar producto" });
    await usuario.click(within(zona).getByRole("button", { name: "Cancelar" }));

    expect(screen.getByTestId("lista")).toBeInTheDocument();
    expect(api.editarProducto).not.toHaveBeenCalled();
  });

  it("avisa si el producto no existe", async () => {
    api.obtenerProductoAdmin.mockRejectedValue(Object.assign(new Error("No"), { status: 404 }));
    renderizar("/admin/productos/99");

    expect(await screen.findByRole("alert")).toHaveTextContent("No encontramos este producto.");
  });

  it("muestra un solo formulario por producto", async () => {
    renderizar("/admin/productos/1");

    const zona = await screen.findByRole("region", { name: "Editar producto" });
    await within(zona).findByRole("option", { name: "Tazas y termos" });
    expect(screen.getAllByRole("form", { name: "Editar producto" })).toHaveLength(1);
  });
});
