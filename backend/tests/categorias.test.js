import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app.js";

const { consultaSimulada } = vi.hoisted(() => ({ consultaSimulada: vi.fn() }));

vi.mock("../src/db/conexion.js", () => ({ consulta: consultaSimulada }));

const categorias = [
  { id: 1, nombre: "Tazas y termos", slug: "tazas-termos", orden: 1 },
  { id: 2, nombre: "Indumentaria", slug: "indumentaria", orden: 2 },
  { id: 3, nombre: "Deportes", slug: "deportes", orden: 3 },
  { id: 4, nombre: "Accesorios", slug: "accesorios", orden: 4 },
];

describe("GET /api/categorias", () => {
  beforeEach(() => {
    consultaSimulada.mockReset().mockResolvedValue({ rows: categorias });
  });

  it("R14 · responde 200 con las 4 categorías en JSON, en el orden de la base (por orden)", async () => {
    const respuesta = await request(app).get("/api/categorias");

    expect(respuesta.status).toBe(200);
    expect(respuesta.headers["content-type"]).toContain("application/json");
    expect(respuesta.body).toEqual(categorias);
  });

  it("R14 · consulta la tabla categorias ordenada por orden, una sola vez y sin tocar la base real", async () => {
    await request(app).get("/api/categorias");

    expect(consultaSimulada).toHaveBeenCalledTimes(1);
    expect(consultaSimulada).toHaveBeenCalledWith(
      expect.stringContaining("SELECT id, nombre, slug, orden FROM categorias ORDER BY orden"),
    );
  });
});
