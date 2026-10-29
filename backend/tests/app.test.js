import { afterAll, describe, expect, it, vi } from "vitest";
import request from "supertest";

vi.stubEnv("FRONTEND_URL", "https://tienda.ejemplo");

const { default: app } = await import("../src/app.js");

describe("Configuración de app", () => {
  afterAll(() => {
    vi.unstubAllEnvs();
  });

  it("permite CORS solo desde FRONTEND_URL", async () => {
    const permitida = await request(app)
      .get("/api/salud")
      .set("Origin", "https://tienda.ejemplo");
    const rechazada = await request(app)
      .get("/api/salud")
      .set("Origin", "https://otro-sitio.ejemplo");

    expect(permitida.headers["access-control-allow-origin"]).toBe("https://tienda.ejemplo");
    expect(rechazada.headers["access-control-allow-origin"]).toBeUndefined();
  });

  it("responde a preflight con las cabeceras y métodos acordados", async () => {
    const respuesta = await request(app)
      .options("/api/auth/ingresar")
      .set("Origin", "https://tienda.ejemplo")
      .set("Access-Control-Request-Method", "PUT")
      .set("Access-Control-Request-Headers", "Authorization, Content-Type");

    expect(respuesta.status).toBe(204);
    expect(respuesta.headers["access-control-allow-origin"]).toBe("https://tienda.ejemplo");
    expect(respuesta.headers["access-control-allow-headers"]).toContain("Authorization");
    expect(respuesta.headers["access-control-allow-headers"]).toContain("Content-Type");
    expect(respuesta.headers["access-control-allow-methods"]).toBe("GET,POST,PATCH,PUT,DELETE");
  });

  it("confía en un único proxy para resolver la IP", () => {
    expect(app.get("trust proxy")).toBe(1);
  });
});
