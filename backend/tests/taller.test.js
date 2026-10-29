import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";

const { consultaSimulada } = vi.hoisted(() => ({ consultaSimulada: vi.fn() }));

vi.mock("../src/db/conexion.js", () => ({ consulta: consultaSimulada }));

const { default: app } = await import("../src/app.js");

const fila = {
  titulo: "Nuestro taller",
  parrafo: "Cada pedido se diseña y se estampa en nuestro taller de Tinogasta.",
  foto_1_url: "/img/sitio/nuestro-taller.jpg",
  foto_1_alt: "Interior del taller de sublimación con una prensa térmica",
  foto_2_url: "https://ejemplo.blob.vercel-storage.com/clienta.webp",
  foto_2_alt: "Una clienta sostiene una remera personalizada",
};

beforeEach(() => {
  consultaSimulada.mockReset().mockResolvedValue({ rows: [fila] });
});

describe("GET /api/taller", () => {
  it("B4-R2 · devuelve el contenido público sin autenticación y con consulta por parámetros", async () => {
    const respuesta = await request(app).get("/api/taller");

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({
      titulo: fila.titulo,
      parrafo: fila.parrafo,
      fotos: [
        { url: fila.foto_1_url, alt: fila.foto_1_alt },
        { url: fila.foto_2_url, alt: fila.foto_2_alt },
      ],
    });
    expect(consultaSimulada).toHaveBeenCalledOnce();
    expect(consultaSimulada).toHaveBeenCalledWith(
      expect.stringMatching(/SELECT[\s\S]*contenido_taller/i),
      [],
    );
  });

  it("B4-R3 · consulta la base y responde 404 cuando todavía no hay fila", async () => {
    consultaSimulada.mockResolvedValueOnce({ rows: [] });

    const respuesta = await request(app).get("/api/taller");

    expect(respuesta.status).toBe(404);
    expect(respuesta.body).toEqual({
      error: "Todavía no cargamos el contenido del taller.",
    });
    expect(consultaSimulada).toHaveBeenCalledOnce();
  });

  it("delega el error de base al manejador interno sin exponer detalles", async () => {
    consultaSimulada.mockRejectedValueOnce(new Error("falla de base"));

    const respuesta = await request(app).get("/api/taller");

    expect(respuesta.status).toBe(500);
    expect(respuesta.body).toEqual({ error: "Algo salió mal, probá de nuevo" });
  });
});
