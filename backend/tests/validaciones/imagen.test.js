import { describe, expect, it } from "vitest";
import { detectarTipoImagen, validarAlt, validarImagen } from "../../src/validaciones/imagen.js";
import { FALSA, JPG, PNG, WEBP } from "../ayudas/imagenes.js";

describe("validarImagen", () => {
  it("B3-R3 · reconoce JPG, PNG y WebP por sus primeros bytes", () => {
    expect(detectarTipoImagen(JPG)).toBe("image/jpeg");
    expect(detectarTipoImagen(PNG)).toBe("image/png");
    expect(detectarTipoImagen(WEBP)).toBe("image/webp");
    expect(validarImagen({ buffer: PNG })).toEqual({ tipo: "image/png" });
  });

  it("B3-R3 · rechaza un archivo que no es imagen aunque diga .jpg", () => {
    expect(validarImagen({ buffer: FALSA, originalname: "foto.jpg", mimetype: "image/jpeg" }).error).toMatch(
      /JPG, PNG o WebP/,
    );
  });

  it("B3-R3 · rechaza la falta de archivo, un archivo vacío y uno de más de 2 MB", () => {
    expect(validarImagen(undefined).error).toMatch(/Elegí una foto/);
    expect(validarImagen({ buffer: Buffer.alloc(0) }).error).toMatch(/Elegí una foto/);
    const grande = Buffer.concat([JPG, Buffer.alloc(2 * 1024 * 1024)]);
    expect(validarImagen({ buffer: grande }).error).toMatch(/2 MB/);
  });

  it("exige un texto alternativo de hasta 160 caracteres", () => {
    expect(validarAlt("Taza blanca estampada")).toBeNull();
    expect(validarAlt("   ")).toMatch(/descripción corta/);
    expect(validarAlt(undefined)).toMatch(/descripción corta/);
    expect(validarAlt("a".repeat(161))).toMatch(/160/);
  });
});
