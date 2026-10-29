import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const api = vi.hoisted(() => ({
  obtenerFotosProducto: vi.fn(),
  subirFotoProducto: vi.fn(),
  borrarFotoProducto: vi.fn(),
  elegirFotoPrincipal: vi.fn(),
}));

vi.mock("../src/services/api.js", () => api);

const { default: FotosProducto } = await import("../src/components/admin/FotosProducto.jsx");

const producto = { id: 3, nombre: "Llavero" };
const fotos = [
  { id: 10, url: "/img/productos/llavero.webp", alt: "Llavero blanco", generada_con_ia: true, orden: 1 },
  { id: 11, url: "https://abc.public.blob.vercel-storage.com/x.jpg", alt: "Llavero real", generada_con_ia: false, orden: 2 },
];
const archivo = (tipo = "image/jpeg", tamano = 1000) =>
  new File([new Uint8Array(tamano)], "foto.jpg", { type: tipo });

beforeEach(() => {
  Object.values(api).forEach((funcion) => funcion.mockReset());
  api.obtenerFotosProducto.mockResolvedValue(fotos);
});
afterEach(cleanup);

describe("FotosProducto", () => {
  it("muestra las fotos con su alt, la principal y la leyenda de IA", async () => {
    render(<FotosProducto producto={producto} />);

    const lista = await screen.findByRole("list", { name: "Fotos del producto" });
    expect(within(lista).getByRole("img", { name: "Llavero blanco" })).toBeInTheDocument();
    expect(within(lista).getByText("Principal")).toBeInTheDocument();
    expect(within(lista).getAllByText("«Generado con IA»")).toHaveLength(1);
    expect(api.obtenerFotosProducto).toHaveBeenCalledWith(3);
  });

  it("avisa cuando el producto no tiene fotos", async () => {
    api.obtenerFotosProducto.mockResolvedValue([]);
    render(<FotosProducto producto={producto} />);

    expect(await screen.findByText("Este producto todavía no tiene fotos.")).toBeInTheDocument();
  });

  it("B3-R1 · sube una foto con su descripción y la marca de IA", async () => {
    api.subirFotoProducto.mockResolvedValue({ id: 12 });
    const alCambiar = vi.fn();
    const usuario = userEvent.setup();
    render(<FotosProducto producto={producto} alCambiar={alCambiar} />);

    await screen.findByRole("list", { name: "Fotos del producto" });
    const foto = archivo();
    await usuario.upload(screen.getByLabelText("Foto"), foto);
    await usuario.type(screen.getByLabelText("Descripción de la foto"), "Llavero con nombre");
    await usuario.click(screen.getByLabelText("La foto fue generada con IA"));
    await usuario.click(screen.getByRole("button", { name: "Subir foto" }));

    expect(api.subirFotoProducto).toHaveBeenCalledWith(3, {
      archivo: foto,
      alt: "Llavero con nombre",
      generadaConIA: true,
    });
    expect(await screen.findByRole("status")).toHaveTextContent("Foto subida.");
    expect(alCambiar).toHaveBeenCalled();
  });

  it("B3-R3 · no envía archivos que no son foto o pesan más de 2 MB, ni fotos sin descripción", async () => {
    const usuario = userEvent.setup({ applyAccept: false });
    render(<FotosProducto producto={producto} />);
    await screen.findByRole("list", { name: "Fotos del producto" });
    const enviar = () => usuario.click(screen.getByRole("button", { name: "Subir foto" }));

    await enviar();
    expect(screen.getByRole("alert")).toHaveTextContent("Elegí una foto.");

    await usuario.upload(screen.getByLabelText("Foto"), archivo("application/pdf"));
    await enviar();
    expect(screen.getByRole("alert")).toHaveTextContent("JPG, PNG o WebP");

    await usuario.upload(screen.getByLabelText("Foto"), archivo("image/png", 2 * 1024 * 1024 + 1));
    await enviar();
    expect(screen.getByRole("alert")).toHaveTextContent("más de 2 MB");

    await usuario.upload(screen.getByLabelText("Foto"), archivo());
    await enviar();
    expect(screen.getByRole("alert")).toHaveTextContent("Escribí una descripción");
    expect(api.subirFotoProducto).not.toHaveBeenCalled();
  });

  it("B3-R4 · pide confirmar antes de borrar una foto", async () => {
    api.borrarFotoProducto.mockResolvedValue([]);
    const usuario = userEvent.setup();
    render(<FotosProducto producto={producto} />);

    await usuario.click(await screen.findByRole("button", { name: "Borrar: Llavero real" }));
    expect(api.borrarFotoProducto).not.toHaveBeenCalled();
    await usuario.click(screen.getByRole("button", { name: "Sí, borrar" }));

    expect(api.borrarFotoProducto).toHaveBeenCalledWith(11);
    expect(await screen.findByRole("status")).toHaveTextContent("Foto borrada.");
  });

  it("B3-R5 · elige otra foto como principal", async () => {
    api.elegirFotoPrincipal.mockResolvedValue(fotos);
    const usuario = userEvent.setup();
    render(<FotosProducto producto={producto} />);

    await usuario.click(await screen.findByRole("button", { name: "Hacer principal" }));

    expect(api.elegirFotoPrincipal).toHaveBeenCalledWith(11);
  });

  it("muestra el mensaje del servidor si rechaza la foto", async () => {
    api.subirFotoProducto.mockRejectedValue(
      Object.assign(new Error("La subida de fotos todavía no está configurada."), { status: 503 }),
    );
    const usuario = userEvent.setup();
    render(<FotosProducto producto={producto} />);

    await screen.findByRole("list", { name: "Fotos del producto" });
    await usuario.upload(screen.getByLabelText("Foto"), archivo());
    await usuario.type(screen.getByLabelText("Descripción de la foto"), "Llavero");
    await usuario.click(screen.getByRole("button", { name: "Subir foto" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("todavía no está configurada");
  });
});
