import { describe, expect, it } from "vitest";
import { prefijoDeNombre, generarCodigo } from "../src/utils/generarCodigo.js";

const codigosDelCatalogo = [
  "TAZ-001",
  "TAZ-002",
  "TER-001",
  "BOT-001",
  "REM-001",
  "BUZ-001",
  "CAM-001",
  "CAN-001",
  "GOR-001",
  "LAV-001",
  "MOU-001",
  "ALM-001",
];

describe("prefijoDeNombre", () => {
  it("B2-R2 · incluye los prefijos conocidos de los códigos del catálogo", () => {
    const casos = [
      ["Taza de cerámica", "TAZ"],
      ["Termo", "TER"],
      ["Botella", "BOT"],
      ["Remera", "REM"],
      ["Buzo", "BUZ"],
      ["Campera", "CAM"],
      ["Canilleras", "CAN"],
      ["Gorra", "GOR"],
      ["Llavero", "LAV"],
      ["Mousepad", "MOU"],
      ["Almohadón", "ALM"],
    ];

    casos.forEach(([nombre, prefijo]) => {
      expect(prefijoDeNombre(nombre)).toBe(prefijo);
    });
  });

  it("B2-R2 · usa el prefijo PRO cuando el nombre no tiene letras", () => {
    expect(prefijoDeNombre("1234")).toBe("PRO");
    expect(prefijoDeNombre("")).toBe("PRO");
  });
});

describe("generarCodigo", () => {
  it("B2-R2 · propuso el primer número libre cuando no hay códigos del prefijo", () => {
    expect(generarCodigo("Chapera de mates", [])).toBe("CHA-001");
  });

  it("B2-R2 · continúa el número conocido de un producto igual que el catálogo", () => {
    expect(generarCodigo("Taza de polímero", ["TAZ-001"])).toBe("TAZ-002");
  });

  it("B2-R2 · sigue al máximo de su prefijo sin reusar números borrados", () => {
    expect(generarCodigo("Buzo de egresados", ["BUZ-001", "BUZ-003"])).toBe("BUZ-004");
  });

  it("B2-R2 · resuelve la colisión avanzando el sufijo numérico", () => {
    expect(generarCodigo("Taza de cerámica", codigosDelCatalogo)).toBe("TAZ-003");
  });

  it("B2-R2 · ignora los códigos de otros prefijos y con formatos ajenos", () => {
    expect(generarCodigo("Remera retro", ["TAZ-001", "X-1", "REM-ABC", "REM-001"])).toBe("REM-002");
  });

  it("B2-R2 · formatea con tres dígitos y admite números de cuatro cifras", () => {
    expect(generarCodigo("Gorra trucker", ["GOR-001", "GOR-999"])).toBe("GOR-1000");
  });
});
