import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
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

  it("en la compu muestra el menú en una fila y lo esconde en el celular", () => {
    renderizarHeader();

    const navegacion = screen.getByRole("navigation", { name: "Navegación principal" });
    expect(navegacion).toHaveClass("hidden", "md:flex");
    expect(screen.getByRole("link", { name: "Ingresar" })).toHaveClass("min-h-11");
  });

  it("en el celular abre y cierra el menú hamburguesa (ícono rosado)", async () => {
    const usuario = userEvent.setup();
    renderizarHeader();

    const boton = screen.getByRole("button", { name: "Abrir menú" });
    expect(boton).toHaveClass("md:hidden", "text-magenta");
    expect(boton).toHaveAttribute("aria-expanded", "false");
    await usuario.click(boton);

    const menu = screen.getByRole("navigation", { name: "Menú" });
    expect(boton).toHaveAttribute("aria-expanded", "true");
    expect(boton).toHaveAttribute("aria-controls", menu.id);
    expect(boton).toHaveAccessibleName("Cerrar menú");
    await usuario.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("navigation", { name: "Menú" })).not.toBeInTheDocument());
  });

  it("con el menú abierto la página no se desplaza y tocar afuera lo cierra", async () => {
    const usuario = userEvent.setup();
    renderizarHeader();

    await usuario.click(screen.getByRole("button", { name: "Abrir menú" }));
    expect(document.body.style.overflow).toBe("hidden");
    await usuario.click(screen.getByTestId("fondo-menu"));

    await waitFor(() => expect(screen.queryByRole("navigation", { name: "Menú" })).not.toBeInTheDocument());
    expect(document.body.style.overflow).toBe("");
  });

  it("tocar «Inicio» estando en el inicio sube al principio de la página", async () => {
    const subir = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const usuario = userEvent.setup();
    renderizarHeader("/");

    await usuario.click(screen.getByRole("link", { name: "Inicio" }));

    await waitFor(() => expect(subir).toHaveBeenCalledWith(expect.objectContaining({ top: 0 })));
    subir.mockRestore();
  });

  it("cierra el menú del celular al ir a otra página", async () => {
    sessionStorage.setItem("seanstore_admin_token", TOKEN);
    const usuario = userEvent.setup();
    renderizarHeader();

    await usuario.click(screen.getByRole("button", { name: "Abrir menú" }));
    const menu = screen.getByRole("navigation", { name: "Menú" });
    await usuario.click(within(menu).getByRole("link", { name: "Panel" }));

    await waitFor(() => expect(screen.queryByRole("navigation", { name: "Menú" })).not.toBeInTheDocument());
    expect(screen.getByRole("heading", { name: "Panel de administración" })).toBeInTheDocument();
  });

  it("muestra Inicio en el menú y marca la sección en la que está la persona", () => {
    renderizarHeader("/catalogo");

    const inicio = screen.getByRole("link", { name: "Inicio" });
    const catalogo = screen.getByRole("link", { name: "Catálogo" });
    expect(inicio).toHaveAttribute("href", "/");
    expect(inicio).not.toHaveAttribute("aria-current");
    expect(catalogo).toHaveAttribute("aria-current", "page");
    expect(catalogo).toHaveClass("underline", "decoration-amarillo");
  });

  it("en el inicio marca solo Inicio", () => {
    renderizarHeader("/");

    expect(screen.getByRole("link", { name: "Inicio" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Catálogo" })).not.toHaveAttribute("aria-current");
  });
});
