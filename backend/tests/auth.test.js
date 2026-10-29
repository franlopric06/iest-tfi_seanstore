import express from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";

const { bcryptMock, jwtMock, consultaMock } = vi.hoisted(() => ({
  bcryptMock: { compare: vi.fn() },
  jwtMock: { sign: vi.fn() },
  consultaMock: vi.fn(),
}));

vi.mock("bcrypt", () => ({ default: bcryptMock }));
vi.mock("jsonwebtoken", () => ({ default: jwtMock }));
vi.mock("../src/db/conexion.js", () => ({ consulta: consultaMock }));

const { ingresar } = await import("../src/controllers/auth.controller.js");

const ADMIN = {
  id: 1,
  email: "admin@seanstore.com",
  contrasena_hash: "$2b$12$hash-de-prueba",
};

function crearApp() {
  const app = express();
  app.use(express.json());
  app.post("/ingresar", ingresar);
  app.use((error, _req, res, _next) => {
    res.status(500).json({ error: "Algo salió mal, probá de nuevo" });
  });
  return app;
}

describe("POST /ingresar controller", () => {
  beforeEach(() => {
    vi.stubEnv("JWT_SECRET", "secreto-de-prueba");
    consultaMock.mockReset().mockResolvedValue({ rows: [ADMIN] });
    bcryptMock.compare.mockReset().mockResolvedValue(true);
    jwtMock.sign.mockReset().mockReturnValue("jwt-firmado");
  });

  it("normaliza el email, compara bcrypt y firma JWT HS256 con expiración de dos horas", async () => {
    const respuesta = await request(crearApp())
      .post("/ingresar")
      .send({ email: "  ADMIN@SeanStore.com ", contrasena: "una-clave-segura" });

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({ token: "jwt-firmado" });
    expect(consultaMock).toHaveBeenCalledWith(
      expect.stringContaining("WHERE email = $1"),
      ["admin@seanstore.com"],
    );
    expect(bcryptMock.compare).toHaveBeenCalledWith("una-clave-segura", ADMIN.contrasena_hash);
    expect(jwtMock.sign).toHaveBeenCalledWith(
      { email: ADMIN.email },
      "secreto-de-prueba",
      { algorithm: "HS256", subject: "1", expiresIn: "2h" },
    );
  });

  it("responde igual ante email inexistente o contraseña incorrecta, sin filtrar datos", async () => {
    bcryptMock.compare.mockResolvedValue(false);
    const incorrecta = await request(crearApp())
      .post("/ingresar")
      .send({ email: "admin@seanstore.com", contrasena: "incorrecta" });

    consultaMock.mockResolvedValue({ rows: [] });
    const inexistente = await request(crearApp())
      .post("/ingresar")
      .send({ email: "nadie@seanstore.com", contrasena: "incorrecta" });

    expect(incorrecta.status).toBe(401);
    expect(inexistente.status).toBe(401);
    expect(incorrecta.body).toEqual({ error: "Email o contraseña incorrectos" });
    expect(inexistente.body).toEqual(incorrecta.body);
    expect(bcryptMock.compare).toHaveBeenCalledTimes(2);
    expect(bcryptMock.compare).toHaveBeenLastCalledWith(
      "incorrecta",
      expect.stringMatching(/^\$2[aby]\$12\$/),
    );
    expect(JSON.stringify(incorrecta.body)).not.toContain(ADMIN.contrasena_hash);
  });

  it("devuelve 503 y no consulta ni firma si falta JWT_SECRET", async () => {
    vi.stubEnv("JWT_SECRET", "");
    const respuesta = await request(crearApp())
      .post("/ingresar")
      .send({ email: "admin@seanstore.com", contrasena: "una-clave-segura" });

    expect(respuesta.status).toBe(503);
    expect(respuesta.body).toEqual({ error: "La autenticación no está configurada." });
    expect(consultaMock).not.toHaveBeenCalled();
    expect(jwtMock.sign).not.toHaveBeenCalled();
  });

  it("no expone errores de base de datos en la respuesta", async () => {
    consultaMock.mockRejectedValue(new Error("detalle interno"));
    const respuesta = await request(crearApp())
      .post("/ingresar")
      .send({ email: "admin@seanstore.com", contrasena: "una-clave-segura" });

    expect(respuesta.status).toBe(500);
    expect(respuesta.body).toEqual({ error: "Algo salió mal, probá de nuevo" });
    expect(JSON.stringify(respuesta.body)).not.toContain("detalle interno");
  });
});
