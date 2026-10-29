import { describe, expect, it } from "vitest";
import { validarProducto } from "../../src/validaciones/producto.js";

const productoValido = {
  nombre: "Taza de cerámica",
  categoria_id: 1,
  precio: 12000,
  stock: 40,
  descripcion: "Taza de 325 ml estampada con tu diseño.",
  talles: [],
  colores: ["Blanco", "Negro"],
  destacado: true,
  activo: true,
};

const conNombreY = (cambios) => ({ ...productoValido, ...cambios });

describe("validarProducto", () => {
  it("B2-R1 · acepta una creación completa y devuelve un objeto sin errores", () => {
    expect(validarProducto(productoValido)).toEqual({});
  });

  it("B2-R1 · acepta descripcion y activo ausentes para la creación mínima", () => {
    const minimo = { ...productoValido };
    delete minimo.descripcion;
    delete minimo.activo;
    expect(validarProducto(minimo)).toEqual({});
  });

  it("B2-R1 · acepta descripcion null porque el negocio puede cotizar sin texto", () => {
    expect(validarProducto(conNombreY({ descripcion: null }))).toEqual({});
  });

  it("B2-R6 · los colores exigen al menos uno y los talles pueden quedar vacíos", () => {
    expect(validarProducto(conNombreY({ colores: [] }))).toHaveProperty("colores");
    expect(validarProducto(productoValido)).not.toHaveProperty("talles");
  });

  it.each([
    ["nombre vacío", conNombreY({ nombre: "" }), "nombre"],
    ["nombre de solo espacios", conNombreY({ nombre: "   " }), "nombre"],
    ["nombre no texto", conNombreY({ nombre: 42 }), "nombre"],
    ["nombre más largo que 120", conNombreY({ nombre: "n".repeat(121) }), "nombre"],
    ["nombre ausente", { ...productoValido, nombre: undefined }, "nombre"],
  ])("B2-R1 · rechaza %s", (_caso, datos, campo) => {
    expect(validarProducto(datos)[campo]).toBeDefined();
  });

  it.each([
    ["categoria_id negativo", conNombreY({ categoria_id: -1 }), "categoria_id"],
    ["categoria_id decimal", conNombreY({ categoria_id: 1.5 }), "categoria_id"],
    ["categoria_id texto", conNombreY({ categoria_id: "tazas-termos" }), "categoria_id"],
    ["categoria_id ausente", { ...productoValido, categoria_id: undefined }, "categoria_id"],
  ])("B2-R6 · rechaza %s", (_caso, datos, campo) => {
    expect(validarProducto(datos)[campo]).toBeDefined();
  });

  it.each([
    ["precio negativo", conNombreY({ precio: -1 }), "precio"],
    ["precio no numérico", conNombreY({ precio: "12000" }), "precio"],
    ["precio NaN", conNombreY({ precio: Number.NaN }), "precio"],
    ["precio infinito", conNombreY({ precio: Number.POSITIVE_INFINITY }), "precio"],
    ["precio más grande que NUMERIC(12,2)", conNombreY({ precio: 10000000000 }), "precio"],
    ["precio ausente", { ...productoValido, precio: undefined }, "precio"],
  ])("B2-R6 · rechaza %s", (_caso, datos, campo) => {
    expect(validarProducto(datos)[campo]).toBeDefined();
  });

  it.each([
    ["stock negativo", conNombreY({ stock: -1 }), "stock"],
    ["stock decimal", conNombreY({ stock: 1.5 }), "stock"],
    ["stock no numérico", conNombreY({ stock: "40" }), "stock"],
    ["stock más grande que un entero de base", conNombreY({ stock: 2147483648 }), "stock"],
    ["stock ausente", { ...productoValido, stock: undefined }, "stock"],
  ])("B2-R6 · rechaza %s", (_caso, datos, campo) => {
    expect(validarProducto(datos)[campo]).toBeDefined();
  });

  it.each([
    ["destacado no booleano", conNombreY({ destacado: "true" }), "destacado"],
    ["destacado ausente", { ...productoValido, destacado: undefined }, "destacado"],
    ["activo no booleano", conNombreY({ activo: 1 }), "activo"],
    ["activo null", conNombreY({ activo: null }), "activo"],
  ])("B2-R6 · rechaza %s", (_caso, datos, campo) => {
    expect(validarProducto(datos)[campo]).toBeDefined();
  });

  it.each([
    ["talles no array", conNombreY({ talles: "M" }), "talles"],
    ["talles con elemento vacío", conNombreY({ talles: ["S", "  "] }), "talles"],
    ["talles con elemento no texto", conNombreY({ talles: [38] }), "talles"],
    ["colores no array", conNombreY({ colores: "Blanco" }), "colores"],
    ["colores con elemento vacío", conNombreY({ colores: ["Blanco", ""] }), "colores"],
    ["colores ausente", { ...productoValido, colores: undefined }, "colores"],
  ])("B2-R6 · rechaza %s", (_caso, datos, campo) => {
    expect(validarProducto(datos)[campo]).toBeDefined();
  });

  it("B2-R6 · rechaza un campo desconocido del cuerpo", () => {
    expect(Object.keys(validarProducto(conNombreY({ extra: true })))).toContain("generales");
  });

  it("B2-R6 · rechaza datos que no son un objeto de cuerpo", () => {
    expect(validarProducto(null)).toBeDefined();
    expect(validarProducto("taza")).toBeDefined();
  });
});
