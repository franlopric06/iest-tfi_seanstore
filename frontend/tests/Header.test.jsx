import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Header from "../src/components/layout/Header.jsx";

const TOKEN = "jwt-de-prueba";

const renderizarHeader = (rutaInicial = "/") =>
  render(
    <MemoryRouter initialEntries={[rutaInicial]}>
      <Header />
      <Routes>
        <Route path="/ingresar" element={<h1>Ingresar al panel</h1>} />
        <Route path="/admin" element={<h1>Panel de administración</h1>} />
      </Routes>
    </MemoryRouter>,
  );

afterEach(() => {
  cleanup();
  sessionStorage.clear();
});

describe("Header · navegación de administración", () => {
  it("vincula el logo al inicio con etiqueta accesible y foco visible", () => {
    renderizarHeader();

    const inicio = screen.getByRole("link", { name: "Ir al inicio" });
    expect(inicio).toHaveAttribute("href", "/");
    expect(inicio).toHaveClass("focus-visible:ring-2");
    expect(inicio.querySelector("img")).toHaveAttribute("alt");
  });

  it("sin sesión muestra el enlace accesible Ingresar con el ícono decorativo", () => {
    renderizarHeader();

    const enlace = screen.getByRole("link", { name: "Ingresar" });
    expect(enlace).toHaveAttribute("href", "/ingresar");
    expect(enlace.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("link", { name: "Catálogo" })).toHaveAttribute("href", "/catalogo");
  });

  it("con sesión muestra Panel y salir borra el token y navega a /ingresar", async () => {
    sessionStorage.setItem("seanstore_admin_token", TOKEN);
    const usuario = userEvent.setup();
    renderizarHeader();

    expect(screen.getByRole("link", { name: "Panel" })).toHaveAttribute("href", "/admin");
    await usuario.click(screen.getByRole("button", { name: "Salir" }));

    expect(screen.getByRole("heading", { name: "Ingresar al panel" })).toBeInTheDocument();
    expect(sessionStorage.getItem("seanstore_admin_token")).toBeNull();
  });

  it("mantiene los controles en una fila y permite ocultar el texto Ingresar en celular", () => {
    renderizarHeader();

    expect(screen.getByRole("navigation", { name: "Navegación principal" })).toHaveClass(
      "flex-nowrap",
    );
    const enlaceIngresar = screen.getByRole("link", { name: "Ingresar" });
    expect(enlaceIngresar).toHaveAttribute("aria-label", "Ingresar");
    expect(enlaceIngresar).toHaveClass("min-h-11");
    expect(enlaceIngresar.querySelector("span")).toHaveClass("sr-only", "md:not-sr-only");
  });
});
