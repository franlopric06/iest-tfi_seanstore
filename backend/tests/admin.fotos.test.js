import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import jwt from "jsonwebtoken";
import request from "supertest";
import { FALSA, JPG } from "./ayudas/imagenes.js";

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
const URL_BLOB = "https://abc.public.blob.vercel-storage.com/productos/3/foto-x.jpg";
const fotoGuardada = { id: 9, url: URL_BLOB, alt: "Llavero", generada_con_ia: false, orden: 2 };

const comoAdmin = (metodo, ruta) =>
  request(app)[metodo](ruta).set("Authorization", `Bearer ${TOKEN}`);

const subir = (archivo = JPG, alt = "Llavero de acrílico con un nombre") =>
  comoAdmin("post", "/api/admin/productos/3/fotos")
    .field("alt", alt)
    .attach("foto", archivo, { filename: "llavero.jpg", contentType: "image/jpeg" });

beforeEach(() => {
  consultaSimulada.mockReset();
  Object.values(almacenamiento).forEach((funcion) => funcion.mockReset());
  almacenamiento.almacenamientoConfigurado.mockReturnValue(true);
  almacenamiento.subirFoto.mockResolvedValue(URL_BLOB);
  almacenamiento.borrarFoto.mockResolvedValue(true);
});

afterAll(() => vi.unstubAllEnvs());

describe("POST /api/admin/productos/:id/fotos", () => {
  it("B1-R12 · sin sesión no recibe ni procesa el archivo", async () => {
    const respuesta = await request(app).post("/api/admin/productos/3/fotos").attach("foto", JPG, "a.jpg");

    expect(respuesta.status).toBe(401);
    expect(almacenamiento.subirFoto).not.toHaveBeenCalled();
  });

  it("B3-R1 · sube la foto a Blob y la guarda al final, sin marca de IA por defecto", async () => {
    consultaSimulada.mockResolvedValueOnce({ rows: [{ id: 3 }] }).mockResolvedValueOnce({ rows: [fotoGuardada] });

    const respuesta = await subir();

    expect(respuesta.status).toBe(201);
    expect(respuesta.body).toEqual(fotoGuardada);
    expect(almacenamiento.subirFoto).toHaveBeenCalledWith("productos/3", expect.any(Buffer), "image/jpeg");
    expect(consultaSimulada).toHaveBeenLastCalledWith(expect.stringMatching(/INSERT INTO producto_fotos/), [
      "3",
      URL_BLOB,
      "Llavero de acrílico con un nombre",
      false,
    ]);
  });

  it("B3-R1 · guarda la marca «Generado con IA» si se pide", async () => {
    consultaSimulada.mockResolvedValueOnce({ rows: [{ id: 3 }] }).mockResolvedValueOnce({ rows: [fotoGuardada] });

    await subir().field("generada_con_ia", "true");

    expect(consultaSimulada.mock.calls[1][1][3]).toBe(true);
  });

  it("B3-R3 · rechaza un archivo que no es imagen y la falta de texto alternativo", async () => {
    expect((await subir(FALSA)).status).toBe(400);
    expect((await subir(JPG, "")).status).toBe(400);
    expect(almacenamiento.subirFoto).not.toHaveBeenCalled();
  });

  it("B3-R3 · rechaza fotos de más de 2 MB", async () => {
    const respuesta = await subir(Buffer.concat([JPG, Buffer.alloc(2 * 1024 * 1024)]));

    expect(respuesta.status).toBe(413);
  });

  it("B3-R6 · avisa si Blob no está configurado", async () => {
    almacenamiento.almacenamientoConfigurado.mockReturnValue(false);

    expect((await subir()).status).toBe(503);
  });

  it("borra la foto de Blob si después falla la base", async () => {
    consultaSimulada.mockResolvedValueOnce({ rows: [{ id: 3 }] }).mockRejectedValueOnce(new Error("Falló la base"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const respuesta = await subir();

    expect(respuesta.status).toBe(500);
    expect(almacenamiento.borrarFoto).toHaveBeenCalledWith(URL_BLOB);
  });

  it("devuelve 404 si el producto no existe", async () => {
    consultaSimulada.mockResolvedValueOnce({ rows: [] });

    expect((await subir()).status).toBe(404);
    expect(almacenamiento.subirFoto).not.toHaveBeenCalled();
  });
});

describe("fotos existentes", () => {
  it("lista las fotos de un producto en orden", async () => {
    consultaSimulada.mockResolvedValueOnce({ rows: [fotoGuardada] });

    const respuesta = await comoAdmin("get", "/api/admin/productos/3/fotos");

    expect(respuesta.body).toEqual([fotoGuardada]);
    expect(consultaSimulada).toHaveBeenCalledWith(expect.stringMatching(/ORDER BY orden/), ["3"]);
  });

  it("B3-R4 · borra primero el archivo, después la fila, y renumera", async () => {
    consultaSimulada
      .mockResolvedValueOnce({ rows: [{ id: 9, producto_id: 3, url: URL_BLOB }] })
      .mockResolvedValue({ rows: [] });

    const respuesta = await comoAdmin("delete", "/api/admin/fotos/9");

    expect(respuesta.status).toBe(200);
    expect(almacenamiento.borrarFoto).toHaveBeenCalledWith(URL_BLOB);
    expect(consultaSimulada.mock.calls[1]).toEqual([expect.stringMatching(/DELETE FROM producto_fotos/), [9]]);
    expect(consultaSimulada.mock.calls[2]).toEqual([expect.stringMatching(/ROW_NUMBER/), [3, null]]);
  });

  it("B3-R4 · si no se pudo borrar el archivo, conserva la fila", async () => {
    consultaSimulada.mockResolvedValueOnce({ rows: [{ id: 9, producto_id: 3, url: URL_BLOB }] });
    almacenamiento.borrarFoto.mockRejectedValue(new Error("Blob caído"));

    const respuesta = await comoAdmin("delete", "/api/admin/fotos/9");

    expect(respuesta.status).toBe(502);
    expect(consultaSimulada).toHaveBeenCalledOnce();
  });

  it("B3-R5 · deja como principal la foto elegida", async () => {
    consultaSimulada
      .mockResolvedValueOnce({ rows: [{ id: 9, producto_id: 3, url: URL_BLOB }] })
      .mockResolvedValue({ rows: [] });

    const respuesta = await comoAdmin("patch", "/api/admin/fotos/9/principal");

    expect(respuesta.status).toBe(200);
    expect(consultaSimulada.mock.calls[1]).toEqual([expect.stringMatching(/ROW_NUMBER/), [3, 9]]);
  });

  it("rechaza ids que no son números", async () => {
    expect((await comoAdmin("delete", "/api/admin/fotos/abc")).status).toBe(400);
    expect(consultaSimulada).not.toHaveBeenCalled();
  });
});
