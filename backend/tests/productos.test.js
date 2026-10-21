import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app.js";

const { consultaSimulada } = vi.hoisted(() => ({ consultaSimulada: vi.fn() }));

vi.mock("../src/db/conexion.js", () => ({ consulta: consultaSimulada }));

const productos = [
  {
    codigo: "TAZA-CER-11OZ",
    slug: "taza-ceramica-11oz",
    nombre: "Taza de cerámica 11 oz",
    categoria: { slug: "tazas-termos", nombre: "Tazas y termos" },
    talles: ["11 oz"],
    colores: ["Blanco", "Negro", "Rojo"],
    precio: "3500.00",
    stock: 12,
    foto: null,
  },
  {
    codigo: "TERMO-ACERO-1L",
    slug: "termo-acero-1l",
    nombre: "Termo de acero 1 L",
    categoria: { slug: "tazas-termos", nombre: "Tazas y termos" },
    talles: ["1 litro"],
    colores: ["Blanco", "Negro"],
    precio: "18000.00",
    stock: 5,
    foto: { url: "/img/productos/termo.webp", alt: "Termo estampado", generada_con_ia: true },
  },
];

const destacados = [
  { ...productos[0], destacado: true },
  { ...productos[1], destacado: true },
  { ...productos[0], codigo: "REMERA-ALG-XL", slug: "remera-algodon-xl", nombre: "Remera de algodón", destacado: true },
  { ...productos[1], codigo: "CANILLERA-PRO", slug: "canilleras-profesionales", nombre: "Canilleras profesionales", destacado: true },
];

const detalle = {
  ...productos[1],
  descripcion: "Termo de acero inoxidable de 1 litro con tu diseño estampado.",
  foto: { url: "/img/productos/termo.webp", alt: "Termo estampado", generada_con_ia: true },
  fotos: [
    { url: "/img/productos/termo.webp", alt: "Termo estampado", generada_con_ia: true, orden: 1 },
    { url: "/img/productos/termo-atras.webp", alt: "Termo por detrás", generada_con_ia: false, orden: 2 },
  ],
};

describe("GET /api/productos", () => {
  beforeEach(() => {
    consultaSimulada.mockReset().mockResolvedValue({ rows: productos });
  });

  it("R14 · responde 200 con los productos en JSON, con precio y stock", async () => {
    const respuesta = await request(app).get("/api/productos");

    expect(respuesta.status).toBe(200);
    expect(respuesta.headers["content-type"]).toContain("application/json");
    expect(respuesta.body).toEqual(productos);
    expect(respuesta.body[0].precio).toBeDefined();
    expect(respuesta.body[0].stock).toBeDefined();
  });

  it("R14 · filtra por ?categoria= con parámetro $1 y sin tocar la base real", async () => {
    await request(app).get("/api/productos?categoria=tazas-termos");

    expect(consultaSimulada).toHaveBeenCalledTimes(1);
    expect(consultaSimulada).toHaveBeenCalledWith(
      expect.stringContaining("WHERE p.activo = TRUE AND c.slug = $1"),
      ["tazas-termos"],
    );
  });

  it("R14 · sin filtro, consulta solo los activos (WHERE p.activo = TRUE) sin parámetros", async () => {
    await request(app).get("/api/productos");

    expect(consultaSimulada).toHaveBeenCalledWith(
      expect.stringMatching(/WHERE p\.activo = TRUE[\s\S]*ORDER BY c\.orden, p\.nombre/),
      [],
    );
  });

  it("R14 · con ?destacados=1 trae hasta 4 destacados y LIMIT 4", async () => {
    consultaSimulada.mockResolvedValue({ rows: destacados });

    const respuesta = await request(app).get("/api/productos?destacados=1");

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toHaveLength(4);
    expect(consultaSimulada).toHaveBeenCalledWith(
      expect.stringMatching(/p\.destacado = TRUE[\s\S]*LIMIT 4/),
      [],
    );
  });

  it("R14 · trae la foto principal (orden = 1) o null cuando no hay fotos", async () => {
    const respuesta = await request(app).get("/api/productos");

    expect(respuesta.body[0].foto).toBeNull();
    expect(respuesta.body[1].foto).toEqual({
      url: "/img/productos/termo.webp",
      alt: "Termo estampado",
      generada_con_ia: true,
    });
  });

  it("R14 · el listado selecciona descripcion de los productos", async () => {
    await request(app).get("/api/productos");

    expect(consultaSimulada).toHaveBeenCalledTimes(1);
    expect(consultaSimulada).toHaveBeenCalledWith(
      expect.stringContaining("p.descripcion"),
      [],
    );
  });
});

describe("GET /api/productos/:slug", () => {
  beforeEach(() => {
    consultaSimulada.mockReset().mockResolvedValue({ rows: [detalle] });
  });

  it("R14 · responde 200 con el detalle: descripcion, precio, stock y fotos ordenadas", async () => {
    const respuesta = await request(app).get("/api/productos/termo-acero-1l");

    expect(respuesta.status).toBe(200);
    expect(respuesta.headers["content-type"]).toContain("application/json");
    expect(respuesta.body.descripcion).toBe("Termo de acero inoxidable de 1 litro con tu diseño estampado.");
    expect(respuesta.body.precio).toBe("18000.00");
    expect(respuesta.body.stock).toBe(5);
    expect(respuesta.body.fotos).toEqual([
      { url: "/img/productos/termo.webp", alt: "Termo estampado", generada_con_ia: true, orden: 1 },
      { url: "/img/productos/termo-atras.webp", alt: "Termo por detrás", generada_con_ia: false, orden: 2 },
    ]);
    expect(respuesta.body.foto).toEqual({
      url: "/img/productos/termo.webp",
      alt: "Termo estampado",
      generada_con_ia: true,
    });
  });

  it("R14 · consulta con el slug como parámetro $1 y solo productos activos", async () => {
    await request(app).get("/api/productos/termo-acero-1l");

    expect(consultaSimulada).toHaveBeenCalledTimes(1);
    expect(consultaSimulada).toHaveBeenCalledWith(
      expect.stringMatching(/WHERE p\.activo = TRUE AND p\.slug = \$1/),
      ["termo-acero-1l"],
    );
  });

  it("R11 · responde 404 en JSON si el slug no existe", async () => {
    consultaSimulada.mockResolvedValue({ rows: [] });

    const respuesta = await request(app).get("/api/productos/no-existe");

    expect(respuesta.status).toBe(404);
    expect(respuesta.headers["content-type"]).toContain("application/json");
    expect(respuesta.body).toHaveProperty("error");
  });

  it("R11 · responde 404 en JSON si el producto está inactivo (la consulta pide solo activos)", async () => {
    consultaSimulada.mockResolvedValue({ rows: [] });

    const respuesta = await request(app).get("/api/productos/remera-pausada");

    expect(respuesta.status).toBe(404);
    expect(respuesta.body).toHaveProperty("error");
    expect(consultaSimulada).toHaveBeenCalledWith(
      expect.stringContaining("p.activo = TRUE"),
      ["remera-pausada"],
    );
  });
});
