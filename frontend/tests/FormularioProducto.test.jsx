import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const api = vi.hoisted(() => ({ obtenerCategorias: vi.fn() }));

vi.mock("../src/services/api.js", () => api);

const { default: FormularioProducto } = await import(
  "../src/components/admin/FormularioProducto.jsx"
);

const categorias = [
  { id: 1, nombre: "Tazas y termos" },
  { id: 2, nombre: "Indumentaria" },
];

const producto = {
  id: 1,
  codigo: "TAZ-001",
  slug: "taza-de-ceramica",
  nombre: "Taza de cerámica",
  categoria_id: 2,
  precio: "12000.00",
  stock: 8,
  descripcion: "Taza estampada con tu diseño.",
  talles: ["Única"],
  colores: ["Rojo"],
  destacado: true,
  activo: true,
};

beforeEach(() => {
  api.obtenerCategorias.mockReset();
  api.obtenerCategorias.mockResolvedValue(categorias);
});

afterEach(cleanup);

describe("FormularioProducto", () => {
  it("muestra los campos editables y no expone código ni slug", async () => {
    render(<FormularioProducto guardar={vi.fn()} onCancelar={vi.fn()} />);

    expect(
      await screen.findByRole("heading", { name: "Agregar producto" }),
    ).toBeInTheDocument();
    for (const etiqueta of [
      "Nombre",
      "Categoría",
      "Precio",
      "Stock",
      "Descripción",
      "Talles",
      "Colores",
      "Destacado",
    ]) {
      expect(screen.getByLabelText(etiqueta)).toBeInTheDocument();
    }
    expect(screen.queryByText("TAZ-001")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Código")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Slug")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Guardar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
  });

  it("carga las categorías de la API en la lista desplegable", async () => {
    render(<FormularioProducto guardar={vi.fn()} onCancelar={vi.fn()} />);

    const select = screen.getByLabelText("Categoría");
    expect(
      await within(select).findByRole("option", { name: "Tazas y termos" }),
    ).toBeInTheDocument();
    expect(within(select).getByRole("option", { name: "Indumentaria" })).toBeInTheDocument();
    expect(api.obtenerCategorias).toHaveBeenCalled();
  });

  it("muestra la carga y el error de las categorías con reintento", async () => {
    const usuario = userEvent.setup();
    api.obtenerCategorias.mockReset();
    api.obtenerCategorias
      .mockRejectedValueOnce(new Error("Falló la API"))
      .mockResolvedValue(categorias);
    render(<FormularioProducto guardar={vi.fn()} onCancelar={vi.fn()} />);

    expect(
      await screen.findByText("Cargando categorías del catálogo"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Categoría")).toBeDisabled();
    expect(await screen.findByText("No pudimos cargar las categorías.")).toBeInTheDocument();
    await usuario.click(screen.getByRole("button", { name: "Reintentar" }));

    expect(
      await screen.findByRole("option", { name: "Tazas y termos" }),
    ).toBeInTheDocument();
  });

  it("envía solo los campos editables y convierte talles y colores en listas", async () => {
    const guardar = vi.fn().mockResolvedValue();
    const usuario = userEvent.setup();
    render(<FormularioProducto guardar={guardar} onCancelar={vi.fn()} />);

    await screen.findByRole("option", { name: "Tazas y termos" });
    await usuario.type(screen.getByLabelText("Nombre"), "Taza nueva");
    await usuario.selectOptions(screen.getByLabelText("Categoría"), "1");
    await usuario.type(screen.getByLabelText("Precio"), "12500");
    await usuario.type(screen.getByLabelText("Stock"), "12");
    await usuario.type(screen.getByLabelText("Talles"), "S, M, , L");
    await usuario.type(screen.getByLabelText("Colores"), "Rojo, Azul");
    await usuario.click(screen.getByLabelText("Destacado"));
    await usuario.click(screen.getByRole("button", { name: "Guardar" }));

    expect(guardar).toHaveBeenCalledWith({
      nombre: "Taza nueva",
      categoria_id: 1,
      precio: 12500,
      stock: 12,
      descripcion: null,
      talles: ["S", "M", "L"],
      colores: ["Rojo", "Azul"],
      destacado: true,
    });
    const campos = Object.keys(guardar.mock.calls[0][0]);
    expect(campos).not.toContain("activo");
    expect(campos).not.toContain("codigo");
    expect(campos).not.toContain("slug");
  });

  it("precarga los valores del producto en modo edición sin código ni slug", async () => {
    render(<FormularioProducto producto={producto} guardar={vi.fn()} onCancelar={vi.fn()} />);

    expect(
      await screen.findByRole("heading", { name: "Editar producto" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre")).toHaveValue("Taza de cerámica");
    expect(screen.getByLabelText("Categoría")).toHaveValue("2");
    expect(screen.getByLabelText("Precio")).toHaveValue(12000);
    expect(screen.getByLabelText("Stock")).toHaveValue(8);
    expect(screen.getByLabelText("Descripción")).toHaveValue(
      "Taza estampada con tu diseño.",
    );
    expect(screen.getByLabelText("Talles")).toHaveValue("Única");
    expect(screen.getByLabelText("Colores")).toHaveValue("Rojo");
    expect(screen.getByLabelText("Destacado")).toBeChecked();
    expect(screen.queryByText("TAZ-001")).not.toBeInTheDocument();
  });

  it("muestra los errores de validación sin descartar los valores ingresados", async () => {
    const guardar = vi.fn();
    const usuario = userEvent.setup();
    render(<FormularioProducto guardar={guardar} onCancelar={vi.fn()} />);

    await screen.findByRole("option", { name: "Tazas y termos" });
    await usuario.type(screen.getByLabelText("Precio"), "-3");
    await usuario.type(screen.getByLabelText("Stock"), "2.5");
    await usuario.type(screen.getByLabelText("Colores"), "Rojo");
    await usuario.click(screen.getByRole("button", { name: "Guardar" }));

    expect(screen.getAllByRole("alert")).toHaveLength(4);
    for (const aviso of [
      "Ingresá el nombre del producto.",
      "Elegí una categoría.",
      "Ingresá un precio válido.",
      "Ingresá un stock válido.",
    ]) {
      expect(screen.getByText(aviso)).toBeInTheDocument();
    }
    expect(screen.getByLabelText("Colores")).toHaveValue("Rojo");
    expect(screen.getByLabelText("Precio")).toHaveValue(-3);
    expect(screen.getByLabelText("Stock")).toHaveValue(2.5);
    expect(guardar).not.toHaveBeenCalled();
  });

  it("informa el error al guardar y conserva los valores editados", async () => {
    const guardar = vi.fn().mockRejectedValueOnce(new Error("Falló la API"));
    const usuario = userEvent.setup();
    render(<FormularioProducto guardar={guardar} onCancelar={vi.fn()} />);

    await screen.findByRole("option", { name: "Tazas y termos" });
    await usuario.type(screen.getByLabelText("Nombre"), "Taza nueva");
    await usuario.selectOptions(screen.getByLabelText("Categoría"), "1");
    await usuario.type(screen.getByLabelText("Precio"), "12500");
    await usuario.type(screen.getByLabelText("Stock"), "12");
    await usuario.type(screen.getByLabelText("Colores"), "Rojo");
    await usuario.click(screen.getByRole("button", { name: "Guardar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No pudimos guardar el producto, probá de nuevo.",
    );
    expect(screen.getByLabelText("Nombre")).toHaveValue("Taza nueva");
    expect(screen.getByLabelText("Precio")).toHaveValue(12500);
  });

  it("muestra el mensaje del servidor cuando rechaza los datos", async () => {
    const errorServidor = Object.assign(new Error("La categoría elegida no existe."), { status: 400 });
    const guardar = vi.fn().mockRejectedValueOnce(errorServidor);
    const usuario = userEvent.setup();
    render(<FormularioProducto guardar={guardar} onCancelar={vi.fn()} />);

    await screen.findByRole("option", { name: "Tazas y termos" });
    await usuario.type(screen.getByLabelText("Nombre"), "Taza nueva");
    await usuario.selectOptions(screen.getByLabelText("Categoría"), "1");
    await usuario.type(screen.getByLabelText("Precio"), "12500");
    await usuario.type(screen.getByLabelText("Stock"), "12");
    await usuario.type(screen.getByLabelText("Colores"), "Rojo");
    await usuario.click(screen.getByRole("button", { name: "Guardar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("La categoría elegida no existe.");
  });

  it("marca como inválidos los campos con aviso", async () => {
    const usuario = userEvent.setup();
    render(<FormularioProducto guardar={vi.fn()} onCancelar={vi.fn()} />);

    await screen.findByRole("option", { name: "Tazas y termos" });
    await usuario.click(screen.getByRole("button", { name: "Guardar" }));

    const nombre = screen.getByLabelText("Nombre");
    expect(nombre).toHaveAttribute("aria-invalid", "true");
    expect(nombre).toHaveAccessibleDescription("Ingresá el nombre del producto.");
    expect(screen.getByLabelText("Colores")).toHaveAccessibleDescription(
      "Ingresá al menos un color, separado por comas.",
    );
  });

  it("inhabilita los botones mientras guarda", async () => {
    const guardar = vi.fn().mockReturnValue(new Promise(() => {}));
    const usuario = userEvent.setup();
    render(<FormularioProducto guardar={guardar} onCancelar={vi.fn()} />);

    await screen.findByRole("option", { name: "Tazas y termos" });
    await usuario.type(screen.getByLabelText("Nombre"), "Taza nueva");
    await usuario.selectOptions(screen.getByLabelText("Categoría"), "1");
    await usuario.type(screen.getByLabelText("Precio"), "12500");
    await usuario.type(screen.getByLabelText("Stock"), "12");
    await usuario.type(screen.getByLabelText("Colores"), "Rojo");
    await usuario.click(screen.getByRole("button", { name: "Guardar" }));

    expect(await screen.findByRole("button", { name: "Guardando…" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeDisabled();
  });

  it("cancela sin llamar a guardar", async () => {
    const guardar = vi.fn();
    const onCancelar = vi.fn();
    const usuario = userEvent.setup();
    render(<FormularioProducto guardar={guardar} onCancelar={onCancelar} />);

    await screen.findByRole("option", { name: "Tazas y termos" });
    await usuario.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(onCancelar).toHaveBeenCalledOnce();
    expect(guardar).not.toHaveBeenCalled();
  });
});
