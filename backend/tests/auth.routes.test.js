import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";

const { ingresarMock } = vi.hoisted(() => ({ ingresarMock: vi.fn() }));

vi.mock("../src/controllers/auth.controller.js", () => ({ ingresar: ingresarMock }));

const { default: app } = await import("../src/app.js");

describe("POST /api/auth/ingresar", () => {
  beforeEach(() => {
    ingresarMock.mockReset().mockImplementation((_req, res) => {
      res.status(401).json({ error: "Email o contraseña incorrectos" });
    });
  });

  it("enruta el ingreso al controlador y responde JSON", async () => {
    const respuesta = await request(app)
      .post("/api/auth/ingresar")
      .set("X-Forwarded-For", "198.51.100.20")
      .send({ email: "admin@seanstore.com", contrasena: "incorrecta" });

    expect(respuesta.status).toBe(401);
    expect(respuesta.headers["content-type"]).toContain("application/json");
    expect(respuesta.body).toEqual({ error: "Email o contraseña incorrectos" });
    expect(ingresarMock).toHaveBeenCalledTimes(1);
  });

  it("aplica el límite antes del controlador: cinco fallos pasan y el sexto queda bloqueado", async () => {
    const ip = "198.51.100.21";

    for (let intento = 0; intento < 5; intento += 1) {
      const respuesta = await request(app)
        .post("/api/auth/ingresar")
        .set("X-Forwarded-For", ip)
        .send({ email: "admin@seanstore.com", contrasena: "incorrecta" });
      expect(respuesta.status).toBe(401);
    }

    const bloqueada = await request(app)
      .post("/api/auth/ingresar")
      .set("X-Forwarded-For", ip)
      .send({ email: "admin@seanstore.com", contrasena: "incorrecta" });

    expect(bloqueada.status).toBe(429);
    expect(ingresarMock).toHaveBeenCalledTimes(5);
  });
});
