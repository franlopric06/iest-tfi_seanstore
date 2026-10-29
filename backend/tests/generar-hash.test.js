import { EventEmitter } from "node:events";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { hashearContrasena } = vi.hoisted(() => ({
  hashearContrasena: vi.fn(),
}));

vi.mock("../src/utils/contrasena.js", () => ({ hashearContrasena }));

const { generarHash } = await import("../scripts/generar-hash.js");

function crearEntrada() {
  const entrada = new EventEmitter();
  entrada.isTTY = true;
  entrada.setRawMode = vi.fn();
  entrada.setEncoding = vi.fn();
  entrada.resume = vi.fn();
  entrada.pause = vi.fn();
  return entrada;
}

describe("scripts/generar-hash.js", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lee sin eco, delega el hash y muestra solamente el hash en stdout", async () => {
    const entrada = crearEntrada();
    const salida = { write: vi.fn() };
    const aviso = { write: vi.fn() };
    hashearContrasena.mockResolvedValue("hash-bcrypt");

    const tarea = generarHash({ entrada, salida, aviso });
    entrada.emit("data", "ContrasenaPrivada12");
    entrada.emit("data", "\r");
    await tarea;

    expect(entrada.setRawMode).toHaveBeenNthCalledWith(1, true);
    expect(entrada.setRawMode).toHaveBeenLastCalledWith(false);
    expect(aviso.write.mock.calls.flat().join("")).not.toContain(
      "ContrasenaPrivada12",
    );
    expect(salida.write.mock.calls.flat()).toEqual(["hash-bcrypt\n"]);
    expect(hashearContrasena).toHaveBeenCalledWith("ContrasenaPrivada12");
  });

  it("rechaza la ejecución si no hay una terminal interactiva", async () => {
    const entrada = crearEntrada();
    entrada.isTTY = false;

    await expect(
      generarHash({
        entrada,
        salida: { write: vi.fn() },
        aviso: { write: vi.fn() },
      }),
    ).rejects.toThrow(/terminal interactiva/);
    expect(hashearContrasena).not.toHaveBeenCalled();
  });
});
