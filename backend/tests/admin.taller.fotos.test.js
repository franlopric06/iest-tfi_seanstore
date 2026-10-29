import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import jwt from "jsonwebtoken";
import request from "supertest";
import { JPG } from "./ayudas/imagenes.js";

const { consultaSimulada, almacenamiento } = vi.hoisted(() => ({
  consultaSimulada: vi.fn(),
  almacenamiento: {
    almacenamientoConfigurado: vi.fn(),
    subirFoto: vi.fn(),
    borrarFoto: vi.fn(),
  },
}));

vi.mock("../src/db/conexion.js", () => ({ consulta: consultaSimulada }));
vi.mock("../src/services/almacenamiento.js", () => almacenamiento);
vi.stubEnv("JWT_SECRET", "secreto-de-prueba-largo");

const { default: app } = await import("../src/app.js");
const TOKEN = jwt.sign({ email: "admin@seanstore.com" }, process.env.JWT_SECRET, {
  algorithm: "HS256",
  subject: "1",
  expiresIn: "2h",
});
const URL_NUEVA = "https://abc.public.blob.vercel-storage.com/taller/foto-nueva.jpg";
const filaNueva = {
  titulo: "Nuestro taller",
  parrafo: "Texto",
  foto_1_url: URL_NUEVA,
  foto_1_alt: "La prensa térmica del taller",
  foto_2_url: "/img/sitio/nuestro-taller-clienta.jpg",
  foto_2_alt: "Una clienta con su remera",
};

const cambiarFoto = (numero = "1", alt = "La prensa térmica del taller") =>
  request(app)
    .put(`/api/admin/taller/fotos/${numero}`)
    .set("Authorization", `Bearer ${TOKEN}`)
    .field("alt", alt)
    .attach("foto", JPG, { filename: "taller.jpg", contentType: "image/jpeg" });

beforeEach(() => {
  consultaSimulada.mockReset();
  Object.values(almacenamiento).forEach((funcion) => funcion.mockReset());
  almacenamiento.almacenamientoConfigurado.mockReturnValue(true);
  almacenamiento.subirFoto.mockResolvedValue(URL_NUEVA);
  almacenamiento.borrarFoto.mockResolvedValue(false);
});

afterAll(() => vi.unstubAllEnvs());

describe("PUT /api/admin/taller/fotos/:numero", () => {
  it("B4-R5 · guarda la foto nueva y devuelve el contenido actualizado", async () => {
    consultaSimulada
      .mockResolvedValueOnce({ rows: [{ url: "/img/sitio/nuestro-taller.jpg" }] })
      .mockResolvedValueOnce({ rows: [filaNueva] });

    const respuesta = await cambiarFoto();

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.fotos[0]).toEqual({ url: URL_NUEVA, alt: "La prensa térmica del taller" });
    expect(consultaSimulada.mock.calls[1]).toEqual([
      expect.stringMatching(/SET foto_1_url = \$1, foto_1_alt = \$2/),
      [URL_NUEVA, "La prensa térmica del taller"],
    ]);
  });

  it("B4-R7 · intenta limpiar la anterior recién después de guardar la nueva", async () => {
    const anterior = "https://abc.public.blob.vercel-storage.com/taller/vieja.jpg";
    consultaSimulada
      .mockResolvedValueOnce({ rows: [{ url: anterior }] })
      .mockResolvedValueOnce({ rows: [filaNueva] });

    await cambiarFoto();

    expect(almacenamiento.borrarFoto).toHaveBeenCalledWith(anterior);
    expect(almacenamiento.borrarFoto.mock.invocationCallOrder[0]).toBeGreaterThan(
      consultaSimulada.mock.invocationCallOrder[1],
    );
  });

  it("B4-R7 · si falla la limpieza de la anterior, la nueva queda igual", async () => {
    consultaSimulada
      .mockResolvedValueOnce({ rows: [{ url: "https://abc.public.blob.vercel-storage.com/taller/vieja.jpg" }] })
      .mockResolvedValueOnce({ rows: [filaNueva] });
    almacenamiento.borrarFoto.mockRejectedValue(new Error("Blob caído"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const respuesta = await cambiarFoto();

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.fotos[0].url).toBe(URL_NUEVA);
  });

  it("B4-R6 · rechaza un número de foto que no existe y la falta de alt", async () => {
    expect((await cambiarFoto("3")).status).toBe(400);
    expect((await cambiarFoto("1", "")).status).toBe(400);
    expect(almacenamiento.subirFoto).not.toHaveBeenCalled();
  });

  it("B1-R12 · requiere sesión", async () => {
    const respuesta = await request(app).put("/api/admin/taller/fotos/1").attach("foto", JPG, "a.jpg");

    expect(respuesta.status).toBe(401);
  });
});
