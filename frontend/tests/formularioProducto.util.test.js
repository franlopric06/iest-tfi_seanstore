import { describe, expect, it } from "vitest";
import {
  borradorDesdeProducto,
  datosDesdeBorrador,
  listaDesdeTexto,
} from "../src/utils/formularioProducto.js";

describe("formularioProducto", () => {
  it("convierte texto separado por comas en una lista sin espacios ni vacíos", () => {
    expect(listaDesdeTexto(" S, M , , L,")).toEqual(["S", "M", "L"]);
    expect(listaDesdeTexto("")).toEqual([]);
  });

  it("precarga un producto aunque falten precio, descripción o talles", () => {
    expect(
      borradorDesdeProducto({
        nombre: "Llavero",
        categoria_id: 4,
        precio: null,
        stock: 0,
        descripcion: null,
        talles: null,
        colores: ["Blanco", "Negro"],
        destacado: false,
      }),
    ).toEqual({
      nombre: "Llavero",
      categoria_id: "4",
      precio: "",
      stock: "0",
      descripcion: "",
      talles: "",
      colores: "Blanco, Negro",
      destacado: false,
    });
  });

  it("muestra el precio de la base sin decimales sobrantes", () => {
    expect(borradorDesdeProducto({ nombre: "Taza", precio: "12000.00", stock: 1 }).precio).toBe("12000");
  });

  it("arma el cuerpo de la API sin código, slug ni activo", () => {
    const datos = datosDesdeBorrador({
      nombre: "  Taza  ",
      categoria_id: "1",
      precio: "10.5",
      stock: "3",
      descripcion: "   ",
      talles: "",
      colores: "Rojo",
      destacado: true,
    });
    expect(datos).toEqual({
      nombre: "Taza",
      categoria_id: 1,
      precio: 10.5,
      stock: 3,
      descripcion: null,
      talles: [],
      colores: ["Rojo"],
      destacado: true,
    });
  });
});
