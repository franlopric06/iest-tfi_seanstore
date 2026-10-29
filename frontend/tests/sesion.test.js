import { afterEach, describe, expect, it, vi } from "vitest";

const { guardarSesion, obtenerSesion, borrarSesion } = await import("../src/utils/sesion.js");

describe("utilidades de sesión", () => {
  const CLAVE = "seanstore_admin_token";

  afterEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("guarda y lee el token desde sessionStorage", () => {
    const guardar = vi.spyOn(Storage.prototype, "setItem");
    const leer = vi.spyOn(Storage.prototype, "getItem");

    guardarSesion("jwt-de-prueba");

    expect(guardar).toHaveBeenCalledWith(CLAVE, "jwt-de-prueba");
    expect(obtenerSesion()).toBe("jwt-de-prueba");
    expect(leer).toHaveBeenCalledWith(CLAVE);
  });

  it("borra el token de sessionStorage", () => {
    sessionStorage.setItem(CLAVE, "jwt-de-prueba");
    const borrar = vi.spyOn(Storage.prototype, "removeItem");

    borrarSesion();

    expect(borrar).toHaveBeenCalledWith(CLAVE);
    expect(obtenerSesion()).toBeNull();
  });

  it("devuelve null cuando no hay sesión", () => {
    expect(obtenerSesion()).toBeNull();
  });

  it("notifica cuando se guarda y cuando se borra la sesión", () => {
    const alCambiar = vi.fn();
    window.addEventListener("sesion-cambiada", alCambiar);

    guardarSesion("jwt-de-prueba");
    borrarSesion();

    expect(alCambiar).toHaveBeenCalledTimes(2);
    window.removeEventListener("sesion-cambiada", alCambiar);
  });

  it("borra y devuelve null si el token está vencido", () => {
    const carga = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) - 1 }))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
    sessionStorage.setItem(CLAVE, `cabecera.${carga}.firma`);
    const borrar = vi.spyOn(Storage.prototype, "removeItem");

    expect(obtenerSesion()).toBeNull();
    expect(borrar).toHaveBeenCalledWith(CLAVE);
  });

  it("no lanza si el acceso a sessionStorage falla", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("almacenamiento bloqueado");
    });
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("almacenamiento bloqueado");
    });
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("almacenamiento bloqueado");
    });

    expect(() => guardarSesion("jwt-de-prueba")).not.toThrow();
    expect(obtenerSesion()).toBeNull();
    expect(() => borrarSesion()).not.toThrow();
  });
});
