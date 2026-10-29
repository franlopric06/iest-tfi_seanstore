import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const almacenamiento = vi.hoisted(() => ({
  obtenerSesion: vi.fn(),
  borrarSesion: vi.fn(),
}));

vi.mock("../src/utils/sesion.js", () => almacenamiento);

const useSesion = (await import("../src/hooks/useSesion.js")).default;

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

describe("useSesion", () => {
  it("refleja una sesión guardada", () => {
    almacenamiento.obtenerSesion.mockReturnValue("jwt-de-prueba");

    const { result } = renderHook(() => useSesion());

    expect(result.current.sesion).toBe("jwt-de-prueba");
  });

  it("refleja que no hay sesión", () => {
    almacenamiento.obtenerSesion.mockReturnValue(null);

    const { result } = renderHook(() => useSesion());

    expect(result.current.sesion).toBeNull();
  });

  it("al salir borra el almacenamiento y actualiza el estado", () => {
    almacenamiento.obtenerSesion.mockReturnValue("jwt-de-prueba");
    const { result } = renderHook(() => useSesion());

    act(() => {
      result.current.salir();
    });

    expect(almacenamiento.borrarSesion).toHaveBeenCalledOnce();
    expect(result.current.sesion).toBeNull();
  });

  it("actualiza la sesión cuando recibe el evento y quita el listener al desmontar", () => {
    almacenamiento.obtenerSesion.mockReturnValueOnce(null).mockReturnValue("jwt-nuevo");
    const { result, unmount } = renderHook(() => useSesion());
    const quitarListener = vi.spyOn(window, "removeEventListener");

    act(() => {
      window.dispatchEvent(new Event("sesion-cambiada"));
    });

    expect(result.current.sesion).toBe("jwt-nuevo");
    unmount();
    expect(quitarListener).toHaveBeenCalledWith("sesion-cambiada", expect.any(Function));
  });
});
