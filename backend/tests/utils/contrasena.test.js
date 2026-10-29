import { beforeEach, describe, expect, it, vi } from "vitest";

const { hash } = vi.hoisted(() => ({ hash: vi.fn() }));

vi.mock("bcrypt", () => ({ default: { hash } }));

const { hashearContrasena, validarContrasena } =
  await import("../../src/utils/contrasena.js");

describe("utils/contrasena.js", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rechaza contraseñas de menos de 12 caracteres", () => {
    expect(validarContrasena("corta")).toMatch(/12 caracteres/);
  });

  it("rechaza valores que no sean texto", () => {
    expect(validarContrasena(null)).toMatch(/texto/);
  });

  it("acepta 12 caracteres y hasta 72 bytes UTF-8", async () => {
    hash.mockResolvedValue("hash-seguro");

    expect(validarContrasena("á".repeat(12))).toBeNull();
    expect(validarContrasena("😀".repeat(18))).toBeNull();
    await expect(hashearContrasena("contraseñaSegura12")).resolves.toBe(
      "hash-seguro",
    );
    expect(hash).toHaveBeenCalledWith("contraseñaSegura12", 12);
  });

  it("rechaza más de 72 bytes UTF-8", async () => {
    expect(validarContrasena("😀".repeat(19))).toMatch(/72 bytes/);
    await expect(hashearContrasena("😀".repeat(19))).rejects.toThrow(/72 bytes/);
    expect(hash).not.toHaveBeenCalled();
  });
});
