import { describe, it, expect, vi } from "vitest";

const { PoolSimulado, opcionesDelPool, consultaSimulada } = vi.hoisted(() => {
  const consultaSimulada = vi.fn();
  const opcionesDelPool = [];
  const PoolSimulado = vi.fn(function (opciones) {
    opcionesDelPool.push(opciones);
    return { query: consultaSimulada };
  });
  return { PoolSimulado, opcionesDelPool, consultaSimulada };
});

vi.mock("pg", () => ({ default: { Pool: PoolSimulado } }));

process.env.DATABASE_URL = "postgres://ejemplo:ejemplo@localhost:5432/seanstore-prueba";

const { consulta } = await import("../src/db/conexion.js");

describe("db/conexion.js", () => {
  it("R14 · crea el pool con la DATABASE_URL del entorno y SSL", () => {
    expect(opcionesDelPool).toEqual([
      {
        connectionString: "postgres://ejemplo:ejemplo@localhost:5432/seanstore-prueba",
        ssl: true,
      },
    ]);
  });

  it("R14 · al importarlo no hace ninguna consulta (no se conecta hasta la primera)", () => {
    expect(consultaSimulada).not.toHaveBeenCalled();
  });

  it("R14 · consulta pasa el texto y los parámetros tal cual, sin armar SQL a mano", async () => {
    const sql = "SELECT * FROM productos WHERE activo = $1";
    await consulta(sql, [true]);

    expect(consultaSimulada).toHaveBeenCalledWith(sql, [true]);
    expect(consultaSimulada).toHaveBeenCalledTimes(1);
  });
});
