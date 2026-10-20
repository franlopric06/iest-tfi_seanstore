import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("GET /api/salud", () => {
  it("responde 200 con estado ok", async () => {
    const respuesta = await request(app).get("/api/salud");

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({ estado: "ok" });
  });

  it("trae la cabecera CORS con el origen del frontend", async () => {
    const respuesta = await request(app)
      .get("/api/salud")
      .set("Origin", "http://localhost:5173");

    expect(respuesta.headers["access-control-allow-origin"]).toBe("http://localhost:5173");
  });
});

describe("Ruta que no existe", () => {
  it("responde 404 en JSON", async () => {
    const respuesta = await request(app).get("/api/no-existe");

    expect(respuesta.status).toBe(404);
    expect(respuesta.headers["content-type"]).toContain("application/json");
    expect(respuesta.body).toHaveProperty("error", "Ruta no encontrada");
  });
});
