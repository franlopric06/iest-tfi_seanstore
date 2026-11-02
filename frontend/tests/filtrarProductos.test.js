import { describe, expect, it } from "vitest";
import { categoriasDe, filtrarProductos } from "../src/utils/filtrarProductos.js";

const lista = [
  { nombre: "Taza de cerámica", codigo: "TAZ-001", categoria: { nombre: "Tazas y termos" }, activo: true },
  { nombre: "Remera", codigo: "REM-001", categoria: { nombre: "Indumentaria" }, activo: false },
  { nombre: "Termo", codigo: "TER-001", categoria: { nombre: "Tazas y termos" }, activo: true },
];

describe("filtrarProductos", () => {
  it("sin filtros devuelve todo", () => {
    expect(filtrarProductos(lista)).toHaveLength(3);
  });

  it("busca por nombre o código, sin tildes ni mayúsculas", () => {
    expect(filtrarProductos(lista, { texto: "ceramica", categoria: "", estado: "todos" })).toHaveLength(1);
    expect(filtrarProductos(lista, { texto: "rem-0", categoria: "", estado: "todos" })[0].nombre).toBe("Remera");
  });

  it("combina categoría y estado", () => {
    expect(filtrarProductos(lista, { texto: "", categoria: "Tazas y termos", estado: "activos" })).toHaveLength(2);
    expect(filtrarProductos(lista, { texto: "", categoria: "", estado: "ocultos" })).toHaveLength(1);
  });

  it("lista las categorías sin repetir", () => {
    expect(categoriasDe(lista)).toEqual(["Tazas y termos", "Indumentaria"]);
  });
});
