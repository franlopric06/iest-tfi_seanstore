import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const api = vi.hoisted(() => ({
  obtenerProductosAdmin: vi.fn(),
  obtenerCategorias: vi.fn(),
  crearProducto: vi.fn(),
  editarProducto: vi.fn(),
  cambiarEstadoProducto: vi.fn(),
  editarRapidoProducto: vi.fn(),
  obtenerFotosProducto: vi.fn(),
}));

vi.mock("../src/services/api.js", () => api);

const { default: GestionProductos } = await import(
  "../src/components/admin/GestionProductos.jsx"
);

const taza = {
  id: 1,
  codigo: "TAZ-001",
  slug: "taza-ceramica",
  nombre: "Taza de cerámica",
  categoria_id: 1,
  categoria: { nombre: "Tazas y termos" },
  precio: "12000.00",
  stock: 8,
  descripcion: "Taza de 325 ml.",
  talles: [],
  colores: ["Blanco", "Negro"],
  destacado: true,
  activo: true,
  foto: null,
};

beforeEach(() => {
  Object.values(api).forEach((funcion) => funcion.mockReset());
  api.obtenerProductosAdmin.mockResolvedValue([taza]);
  api.obtenerFotosProducto.mockResolvedValue([]);
  api.obtenerCategorias.mockResolvedValue([
    { id: 1, nombre: "Tazas y termos" },
    { id: 2, nombre: "Indumentaria" },
  ]);
});

afterEach(cleanup);

const completarAlta = async (usuario) => {
  const formulario = screen.getByRole("form", { name: "Agregar producto" });
  const campo = (etiqueta) => within(formulario).getByLabelText(etiqueta);
  await within(formulario).findByRole("option", { name: "Tazas y termos" });
  await usuario.type(campo("Nombre"), "Llavero de acrílico");
  await usuario.selectOptions(campo("Categoría"), "1");
  await usuario.type(campo("Precio"), "3500");
  await usuario.type(campo("Stock"), "20");
  await usuario.type(campo("Colores"), "Transparente");
  return formulario;
};

describe("GestionProductos", () => {
  it("B2-R1 · muestra «Nuevo producto» aunque todavía no haya productos", async () => {
    api.obtenerProductosAdmin.mockResolvedValue([]);
    render(<GestionProductos />);

    expect(await screen.findByText("Todavía no hay productos cargados.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nuevo producto" })).toBeInTheDocument();
  });

  it("B2-R1 · crea un producto, avisa y vuelve a pedir la lista", async () => {
    api.crearProducto.mockResolvedValue({ id: 2 });
    const usuario = userEvent.setup();
    render(<GestionProductos />);

    await usuario.click(await screen.findByRole("button", { name: "Nuevo producto" }));
    const formulario = await completarAlta(usuario);
    await usuario.click(within(formulario).getByRole("button", { name: "Guardar" }));

    expect(api.crearProducto).toHaveBeenCalledWith(
      expect.objectContaining({ nombre: "Llavero de acrílico", colores: ["Transparente"] }),
    );
    expect(await screen.findByRole("status")).toHaveTextContent("Producto creado.");
    expect(screen.queryByRole("form", { name: "Agregar producto" })).not.toBeInTheDocument();
    expect(api.obtenerProductosAdmin).toHaveBeenCalledTimes(2);
  });

  it("B2-R4 · abre la edición con los datos del producto y guarda con su id", async () => {
    api.editarProducto.mockResolvedValue(taza);
    const usuario = userEvent.setup();
    render(<GestionProductos />);

    const tabla = await screen.findByRole("table", { name: "Productos" });
    await usuario.click(within(tabla).getByRole("button", { name: "Editar Taza de cerámica" }));

    const formulario = screen.getByRole("form", { name: "Editar producto" });
    expect(within(formulario).getByLabelText("Nombre")).toHaveValue("Taza de cerámica");
    expect(within(formulario).getByLabelText("Colores")).toHaveValue("Blanco, Negro");
    await within(formulario).findByRole("option", { name: "Tazas y termos" });
    await usuario.click(within(formulario).getByRole("button", { name: "Guardar" }));

    expect(api.editarProducto).toHaveBeenCalledWith(1, expect.objectContaining({ nombre: "Taza de cerámica" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Producto actualizado.");
  });

  it("cancela el formulario sin guardar nada", async () => {
    const usuario = userEvent.setup();
    render(<GestionProductos />);

    await usuario.click(await screen.findByRole("button", { name: "Nuevo producto" }));
    await usuario.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(screen.queryByRole("form")).not.toBeInTheDocument();
    expect(api.crearProducto).not.toHaveBeenCalled();
  });

  it("B2-R5 · oculta un producto activo sin borrarlo", async () => {
    api.cambiarEstadoProducto.mockResolvedValue({ ...taza, activo: false });
    const usuario = userEvent.setup();
    render(<GestionProductos />);

    const tabla = await screen.findByRole("table", { name: "Productos" });
    await usuario.click(within(tabla).getByRole("button", { name: "Ocultar Taza de cerámica" }));

    expect(api.cambiarEstadoProducto).toHaveBeenCalledWith(1, false);
    expect(await screen.findByRole("status")).toHaveTextContent("ya no se ve en la tienda");
  });

  it("B2-R5 · vuelve a mostrar un producto oculto", async () => {
    api.obtenerProductosAdmin.mockResolvedValue([{ ...taza, activo: false }]);
    api.cambiarEstadoProducto.mockResolvedValue(taza);
    const usuario = userEvent.setup();
    render(<GestionProductos />);

    const tabla = await screen.findByRole("table", { name: "Productos" });
    await usuario.click(within(tabla).getByRole("button", { name: "Mostrar Taza de cerámica" }));

    expect(api.cambiarEstadoProducto).toHaveBeenCalledWith(1, true);
  });

  it("avisa si no pudo cambiar el estado", async () => {
    api.cambiarEstadoProducto.mockRejectedValue(new Error("Falló la API"));
    const usuario = userEvent.setup();
    render(<GestionProductos />);

    const tabla = await screen.findByRole("table", { name: "Productos" });
    await usuario.click(within(tabla).getByRole("button", { name: "Ocultar Taza de cerámica" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No pudimos cambiar el estado del producto, probá de nuevo.",
    );
  });
});
