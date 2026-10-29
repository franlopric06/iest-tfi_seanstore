import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const sesionMock = vi.hoisted(() => ({ actual: null }));

vi.mock("../src/hooks/useSesion.js", () => ({
  default: () => ({ sesion: sesionMock.actual, salir: vi.fn() }),
}));

const { default: RutaProtegida } = await import(
  "../src/components/admin/RutaProtegida.jsx"
);

afterEach(() => {
  cleanup();
  sesionMock.actual = null;
});

const renderizarRuta = () =>
  render(
    <MemoryRouter initialEntries={["/admin"]}>
      <Routes>
        <Route path="/ingresar" element={<h1>Ingresar al panel</h1>} />
        <Route element={<RutaProtegida />}>
          <Route path="/admin" element={<h1>Panel protegido</h1>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

describe("RutaProtegida", () => {
  it("redirige a /ingresar cuando no hay sesión", () => {
    sesionMock.actual = null;
    renderizarRuta();

    expect(screen.getByRole("heading", { name: "Ingresar al panel" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Panel protegido" })).not.toBeInTheDocument();
  });

  it("muestra la ruta hija cuando hay sesión", () => {
    sesionMock.actual = "jwt-de-prueba";
    renderizarRuta();

    expect(screen.getByRole("heading", { name: "Panel protegido" })).toBeInTheDocument();
  });
});
