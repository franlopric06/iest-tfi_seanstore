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

describe("PATCH /api/admin/productos/:id/edicion-rapida", () => {
  it("B1-R15 · actualiza precio, stock y destacado con parámetros", async () => {
    const productoActualizado = {
      ...productos[0],
      precio: "12500.00",
      stock: 6,
      destacado: false,
    };
    consultaSimulada.mockResolvedValueOnce({ rows: [productoActualizado] });

    const respuesta = await comoAdmin(
      "patch",
      "/api/admin/productos/1/edicion-rapida",
    ).send({
      precio: 12500,
      stock: 6,
      destacado: false,
    });

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual(productoActualizado);
    expect(consultaSimulada).toHaveBeenCalledWith(
      expect.stringMatching(
        /UPDATE productos[\s\S]*SET[\s\S]*precio\s*=\s*\$1[\s\S]*stock\s*=\s*\$2[\s\S]*destacado\s*=\s*\$3[\s\S]*WHERE id\s*=\s*\$4[\s\S]*RETURNING/i,
      ),
      [12500, 6, false, "1"],
    );
  });

  it.each([
    ["precio negativo", { precio: -1, stock: 2, destacado: true }],
    ["precio no numérico", { precio: "12000", stock: 2, destacado: true }],
    ["stock negativo", { precio: 100, stock: -1, destacado: true }],
    ["stock decimal", { precio: 100, stock: 1.5, destacado: true }],
    ["destacado no booleano", { precio: 100, stock: 2, destacado: "true" }],
  ])("B1-R16 · rechaza %s antes de consultar la base", async (_caso, cuerpo) => {
    const respuesta = await comoAdmin(
      "patch",
      "/api/admin/productos/1/edicion-rapida",
    ).send(cuerpo);

    expect(respuesta.status).toBe(400);
    expect(respuesta.body).toHaveProperty("error");
    expect(consultaSimulada).not.toHaveBeenCalled();
  });

  it("B1-R15 · responde 404 cuando el producto no existe", async () => {
    consultaSimulada.mockResolvedValueOnce({ rows: [] });

    const respuesta = await comoAdmin(
      "patch",
      "/api/admin/productos/999/edicion-rapida",
    ).send({
      precio: 100,
      stock: 2,
      destacado: true,
    });

    expect(respuesta.status).toBe(404);
    expect(respuesta.body).toHaveProperty("error");
    expect(consultaSimulada).toHaveBeenCalledWith(
      expect.stringMatching(/UPDATE productos/),
      [100, 2, true, "999"],
    );
  });
});
