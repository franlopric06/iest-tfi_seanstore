import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const api = vi.hoisted(() => ({ cambiarFotoTaller: vi.fn() }));
vi.mock("../src/services/api.js", () => api);

const { default: FotosTallerSolo } = await import("../src/components/admin/FotosTaller.jsx");
const { useState } = await import("react");

// Las marcas viven en EditorTaller; acá se simulan con un estado propio.
const FotosTaller = ({ fotosIniciales }) => {
  const [marcas, setMarcas] = useState(fotosIniciales.map((foto) => Boolean(foto.generada_con_ia)));
  return (
    <FotosTallerSolo
      fotosIniciales={fotosIniciales}
      marcas={marcas}
      alMarcar={(indice, valor) => setMarcas((m) => m.map((x, i) => (i === indice ? valor : x)))}
    />
  );
};

const fotos = [
  { url: "/img/sitio/nuestro-taller.jpg", alt: "La prensa del taller", generada_con_ia: true },
  { url: "/img/sitio/nuestro-taller-clienta.jpg", alt: "Una clienta con su remera", generada_con_ia: false },
];
const URL_NUEVA = "https://abc.public.blob.vercel-storage.com/taller/nueva.jpg";

afterEach(cleanup);

describe("FotosTaller", () => {
  it("B4-R5 · reemplaza la foto 2 manteniendo la descripción actual y muestra la nueva", async () => {
    api.cambiarFotoTaller.mockResolvedValue({
      fotos: [fotos[0], { url: URL_NUEVA, alt: fotos[1].alt, generada_con_ia: true }],
    });
    const usuario = userEvent.setup();
    render(<FotosTaller fotosIniciales={fotos} />);

    const foto2 = screen.getByRole("article", { name: "Foto 2" });
    expect(within(foto2).getByLabelText("Descripción de la foto")).toHaveValue("Una clienta con su remera");
    const archivo = new File([new Uint8Array(10)], "taller.jpg", { type: "image/jpeg" });
    await usuario.upload(within(foto2).getByLabelText("Foto"), archivo);
    expect(within(foto2).queryByText("«Generado con IA»")).not.toBeInTheDocument();
    await usuario.click(within(foto2).getByLabelText("La foto fue generada con IA"));
    await usuario.click(within(foto2).getByRole("button", { name: "Cambiar foto" }));

    expect(api.cambiarFotoTaller).toHaveBeenCalledWith(2, {
      archivo,
      alt: "Una clienta con su remera",
      generadaConIA: true,
    });
    expect(await within(foto2).findByText("«Generado con IA»")).toBeInTheDocument();
    expect(await within(foto2).findByRole("status")).toHaveTextContent("Foto subida.");
    expect(within(foto2).getByRole("img", { name: "Una clienta con su remera" })).toHaveAttribute("src", URL_NUEVA);
  });

  it("B4-R6 · conserva la foto actual si falla el cambio", async () => {
    api.cambiarFotoTaller.mockRejectedValue(new Error("Falló"));
    const usuario = userEvent.setup();
    render(<FotosTaller fotosIniciales={fotos} />);

    const foto1 = screen.getByRole("article", { name: "Foto 1" });
    await usuario.upload(within(foto1).getByLabelText("Foto"), new File(["x"], "a.png", { type: "image/png" }));
    await usuario.click(within(foto1).getByRole("button", { name: "Cambiar foto" }));

    expect(await within(foto1).findByRole("alert")).toHaveTextContent("No pudimos guardar la foto");
    expect(within(foto1).getByRole("img")).toHaveAttribute("src", fotos[0].url);
  });
});
