import { describe, expect, it } from "vitest";
import { generarSlug } from "../src/utils/generarSlug.js";

describe("generarSlug", () => {
  it("B2-R3 · normaliza el nombre a minúsculas con guiones", () => {
    expect(generarSlug("Chapera de mates", [])).toBe("chapera-de-mates");
  });

  it("B2-R3 · le quita los acentos y la ñ", () => {
    expect(generarSlug("Almohadón", [])).toBe("almohadon");
    expect(generarSlug("Cañitas de mates", [])).toBe("canitas-de-mates");
  });

  it("B2-R3 · saca mayúsculas, espacios dobles y símbolos", () => {
    expect(generarSlug("Mi   Taza--Personalizada (azul)!!", [])).toBe("mi-taza-personalizada-azul");
  });

  it("B2-R3 · deja letras, números y guiones, igual que los slugs del catálogo", () => {
    expect(generarSlug("Vinilo 3 × 5", [])).toBe("vinilo-3-5");
  });

  it("B2-R4 · ante colisión agrega un sufijo numérico y nunca modifica los existentes", () => {
    const existentes = ["remera", "remera-2", "remera-3", "termo"];
    expect(generarSlug("Remera", existentes)).toBe("remera-4");
    expect(existentes).toEqual(["remera", "remera-2", "remera-3", "termo"]);
  });

  it("B2-R4 · el primer slug no lleva sufijo y el segundo es el primero libre", () => {
    expect(generarSlug("Termo", [])).toBe("termo");
    expect(generarSlug("Termo", ["termo"])).toBe("termo-2");
  });

  it("B2-R4 · corta el slug a 140 caracteres, el límite de la base", () => {
    const nombre = "t".repeat(300);
    expect(generarSlug(nombre, [])).toHaveLength(140);
  });
});
