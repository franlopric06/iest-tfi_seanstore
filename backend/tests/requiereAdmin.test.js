import express from "express";
import { afterEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { createHmac } from "node:crypto";
import requiereAdmin from "../src/middleware/requiereAdmin.js";

const SECRETO = "secreto-de-prueba-largo";

function codificar(valor) {
  return Buffer.from(JSON.stringify(valor)).toString("base64url");
}

function crearToken(algoritmo, claims = {}, secreto = SECRETO) {
  const cabecera = codificar({ alg: algoritmo, typ: "JWT" });
  const carga = codificar({ sub: "1", email: "admin@seanstore.com", ...claims });
  const firmado = `${cabecera}.${carga}`;
  const hash = algoritmo === "HS384" ? "sha384" : "sha256";
  const firma = createHmac(hash, secreto).update(firmado).digest("base64url");
  return `${firmado}.${firma}`;
}

function crearApp() {
  const app = express();
  app.get("/protegida", requiereAdmin, (req, res) => {
    res.json({ administrador: req.administrador });
  });
  return app;
}

describe("middleware requiereAdmin", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("rechaza token ausente o inválido con 401", async () => {
    vi.stubEnv("JWT_SECRET", SECRETO);
    const app = crearApp();

    expect((await request(app).get("/protegida")).status).toBe(401);
    expect((await request(app).get("/protegida").set("Authorization", "Bearer no-es-jwt")).status).toBe(401);
  });

  it("rechaza token vencido con 401", async () => {
    vi.stubEnv("JWT_SECRET", SECRETO);
    const respuesta = await request(crearApp())
      .get("/protegida")
      .set("Authorization", `Bearer ${crearToken("HS256", { exp: 1 })}`);

    expect(respuesta.status).toBe(401);
  });

  it("rechaza tokens firmados con un algoritmo distinto de HS256", async () => {
    vi.stubEnv("JWT_SECRET", SECRETO);
    const respuesta = await request(crearApp())
      .get("/protegida")
      .set("Authorization", `Bearer ${crearToken("HS384")}`);

    expect(respuesta.status).toBe(401);
  });

  it("acepta un JWT HS256 válido y expone la identidad verificada", async () => {
    vi.stubEnv("JWT_SECRET", SECRETO);
    const respuesta = await request(crearApp())
      .get("/protegida")
      .set("Authorization", `Bearer ${crearToken("HS256")}`);

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({
      administrador: { id: "1", email: "admin@seanstore.com" },
    });
  });

  it("devuelve 503 si falta JWT_SECRET", async () => {
    vi.stubEnv("JWT_SECRET", "");
    const respuesta = await request(crearApp())
      .get("/protegida")
      .set("Authorization", `Bearer ${crearToken("HS256")}`);

    expect(respuesta.status).toBe(503);
    expect(respuesta.body).toEqual({ error: "La autenticación no está configurada." });
  });
});
