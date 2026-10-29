import express from "express";
import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { crearLimiteIngreso } from "../src/middleware/limiteIngreso.js";

const IP_1 = "192.0.2.10";
const IP_2 = "203.0.113.8";

describe("middleware limiteIngreso", () => {
  let app;
  let ahora;

  beforeEach(() => {
    ahora = Date.parse("2026-10-29T12:00:00Z");
    app = express();
    app.set("trust proxy", 1);
    app.use(express.json());
    app.post("/ingresar", crearLimiteIngreso({ ahora: () => ahora }), (req, res) => {
      res.status(req.body.exito ? 200 : 401).json({ ok: req.body.exito });
    });
  });

  async function ingresar(ip, exito = false) {
    return request(app).post("/ingresar").set("X-Forwarded-For", ip).send({ exito });
  }

  it("deja pasar cinco fallos y bloquea el sexto intento", async () => {
    for (let intento = 0; intento < 5; intento += 1) {
      expect((await ingresar(IP_1)).status).toBe(401);
    }

    expect((await ingresar(IP_1)).status).toBe(429);
  });

  it("reinicia el contador cuando el ingreso es exitoso", async () => {
    for (let intento = 0; intento < 4; intento += 1) {
      expect((await ingresar(IP_1)).status).toBe(401);
    }
    expect((await ingresar(IP_1, true)).status).toBe(200);

    for (let intento = 0; intento < 5; intento += 1) {
      expect((await ingresar(IP_1)).status).toBe(401);
    }
    expect((await ingresar(IP_1)).status).toBe(429);
  });

  it("reinicia la ventana después de 15 minutos", async () => {
    for (let intento = 0; intento < 5; intento += 1) {
      await ingresar(IP_1);
    }
    expect((await ingresar(IP_1)).status).toBe(429);

    ahora += 15 * 60 * 1000;
    for (let intento = 0; intento < 5; intento += 1) {
      expect((await ingresar(IP_1)).status).toBe(401);
    }
    expect((await ingresar(IP_1)).status).toBe(429);
  });

  it("mantiene contadores separados por IP", async () => {
    for (let intento = 0; intento < 5; intento += 1) {
      await ingresar(IP_1);
    }

    expect((await ingresar(IP_1)).status).toBe(429);
    expect((await ingresar(IP_2)).status).toBe(401);
  });
});
