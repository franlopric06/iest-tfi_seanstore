import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import jwt from "jsonwebtoken";
import request from "supertest";

const { consultaSimulada } = vi.hoisted(() => ({ consultaSimulada: vi.fn() }));

vi.mock("../src/db/conexion.js", () => ({ consulta: consultaSimulada }));

vi.stubEnv("JWT_SECRET", "secreto-de-prueba-largo");

const { default: app } = await import("../src/app.js");
const TOKEN = jwt.sign(
  { email: "admin@seanstore.com" },
  process.env.JWT_SECRET,
  { algorithm: "HS256", subject: "1", expiresIn: "2h" },
);

const fila = {
  titulo: "Nuestro taller",
  parrafo: "Cada pedido se diseña y se estampa en nuestro taller de Tinogasta.",
  foto_1_url: "/img/sitio/nuestro-taller.jpg",
  foto_1_alt: "Interior del taller de sublimación con una prensa térmica",
  foto_2_url: "/img/sitio/nuestro-taller-clienta.jpg",
  foto_2_alt: "Una clienta sostiene una remera personalizada",
};

const comoAdmin = (metodo, ruta) =>
  request(app)[metodo](ruta).set("Authorization", `Bearer ${TOKEN}`);

beforeEach(() => {
  consultaSimulada.mockReset().mockResolvedValue({ rows: [fila] });
});

afterAll(() => {
  vi.unstubAllEnvs();
});

describe("PATCH /api/admin/taller", () => {
  it("B1-R12 · requiere un JWT admin válido", async () => {
    const respuesta = await request(app).patch("/api/admin/taller").send({
      titulo: "Nuestro taller",
      parrafo: "Texto actualizado.",
    });

    expect(respuesta.status).toBe(401);
    expect(consultaSimulada).not.toHaveBeenCalled();
  });

  it("B4-R4 · actualiza título y párrafo de la fila única con parámetros", async () => {
    consultaSimulada.mockResolvedValueOnce({
      rows: [
        {
          ...fila,
          titulo: "Así se sublima en Tinogasta",
          parrafo: "Atualizamos el taller con una prensa nueva.",
        },
      ],
    });

    const respuesta = await comoAdmin("patch", "/api/admin/taller").send({
      titulo: "Así se sublima en Tinogasta",
      parrafo: "Atualizamos el taller con una prensa nueva.",
    });

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({
      titulo: "Así se sublima en Tinogasta",
      parrafo: "Atualizamos el taller con una prensa nueva.",
      fotos: [
        { url: fila.foto_1_url, alt: fila.foto_1_alt },
        { url: fila.foto_2_url, alt: fila.foto_2_alt },
      ],
    });
    expect(consultaSimulada).toHaveBeenCalledWith(
      expect.stringMatching(
        /UPDATE contenido_taller[\s\S]*titulo\s*=\s*\$1[\s\S]*parrafo\s*=\s*\$2[\s\S]*RETURNING/i,
      ),
      ["Así se sublima en Tinogasta", "Atualizamos el taller con una prensa nueva."],
    );
  });

  it.each([
    ["título vacío", { titulo: "", parrafo: "Texto." }],
    ["título de solo espacios", { titulo: "   ", parrafo: "Texto." }],
    ["título más largo que 120 caracteres", { titulo: "x".repeat(121), parrafo: "Texto." }],
    ["título ausente", { parrafo: "Texto." }],
    ["párrafo vacío", { titulo: "Título.", parrafo: "" }],
    ["párrafo ausente", { titulo: "Título." }],
    ["campos de más", { titulo: "Título.", parrafo: "Texto.", extra: true }],
  ])("B4-R6 · rechaza %s sin consultar la base", async (_caso, cuerpo) => {
    const respuesta = await comoAdmin("patch", "/api/admin/taller").send(cuerpo);

    expect(respuesta.status).toBe(400);
    expect(respuesta.body).toHaveProperty("error");
    expect(consultaSimulada).not.toHaveBeenCalled();
  });

  it("B4-R6 · informa el error si el guardado falla, sin éxito falso", async () => {
    consultaSimulada.mockRejectedValueOnce(new Error("falla de base"));

    const respuesta = await comoAdmin("patch", "/api/admin/taller").send({
      titulo: "Título válido",
      parrafo: "Texto válido.",
    });

    expect(respuesta.status).toBe(500);
    expect(respuesta.body.error).not.toContain("guardado");
  });
});
