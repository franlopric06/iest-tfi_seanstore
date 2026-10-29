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

const productos = [
  {
    id: 1,
    codigo: "TAZ-001",
    slug: "taza-ceramica",
    nombre: "Taza de cerámica",
    categoria: { slug: "tazas-termos", nombre: "Tazas y termos" },
    precio: "12000.00",
    stock: 40,
    destacado: true,
    activo: true,
  },
  {
    id: 2,
    codigo: "REM-002",
    slug: "remera",
    nombre: "Remera",
    categoria: { slug: "indumentaria", nombre: "Indumentaria" },
    precio: "16000.00",
    stock: 0,
    destacado: false,
    activo: false,
  },
];

const comoAdmin = (metodo, ruta) =>
  request(app)[metodo](ruta).set("Authorization", `Bearer ${TOKEN}`);

beforeEach(() => {
  consultaSimulada.mockReset().mockResolvedValue({ rows: productos });
});

afterAll(() => {
  vi.unstubAllEnvs();
});

describe("GET /api/admin/productos", () => {
  it("B1-R14 · lista productos activos e inactivos junto con el código", async () => {
    const respuesta = await comoAdmin("get", "/api/admin/productos");

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual(productos);
    expect(respuesta.body.map((producto) => producto.codigo)).toEqual(["TAZ-001", "REM-002"]);
    expect(respuesta.body[1].activo).toBe(false);
    expect(consultaSimulada).toHaveBeenCalledOnce();
    expect(consultaSimulada).toHaveBeenCalledWith(
      expect.stringMatching(/p\.codigo[\s\S]*p\.activo[\s\S]*JOIN categorias/),
      [],
    );
    expect(consultaSimulada.mock.calls[0][0]).not.toMatch(/WHERE\s+p\.activo\s*=\s*TRUE/i);
  });

  it("B1-R12 · requiere un JWT admin válido", async () => {
    const respuesta = await request(app).get("/api/admin/productos");

    expect(respuesta.status).toBe(401);
    expect(consultaSimulada).not.toHaveBeenCalled();
  });

  it("B1-R12 · protege también rutas administrativas futuras", async () => {
    const respuesta = await request(app).get("/api/admin/ruta-futura/anidada");

    expect(respuesta.status).toBe(401);
    expect(consultaSimulada).not.toHaveBeenCalled();
  });
});
