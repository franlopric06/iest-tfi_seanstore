import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const { ingresarMock } = vi.hoisted(() => ({ ingresarMock: vi.fn() }));

vi.mock("../src/services/api.js", () => ({ ingresar: ingresarMock }));

const { default: Ingresar } = await import("../src/pages/admin/Ingresar.jsx");

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

function renderIngresar() {
  return render(
    <MemoryRouter initialEntries={["/ingresar"]}>
      <Routes>
        <Route path="/ingresar" element={<Ingresar />} />
        <Route path="/admin" element={<h1>Panel de administración</h1>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("Ingresar", () => {
  it("presenta labels accesibles, foco visible y noindex", async () => {
    renderIngresar();

    expect(await screen.findByRole("heading", { name: "Ingresar al panel" })).toHaveClass(
      "font-titulos",
    );
    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
    expect(screen.getByLabelText("Contraseña")).toHaveAttribute("type", "password");
    expect(screen.getByLabelText("Email")).toHaveClass("focus-visible:ring-magenta");
    await waitFor(() => {
      expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute(
        "content",
        "noindex, nofollow",
      );
    });
  });

  it("muestra Ingresando… mientras espera y navega a /admin al ingresar", async () => {
    let completarIngreso;
    ingresarMock.mockReturnValue(
      new Promise((resolve) => {
        completarIngreso = resolve;
      }),
    );
    const usuario = userEvent.setup();
    renderIngresar();

    await usuario.type(screen.getByLabelText("Email"), "admin@seanstore.com");
    await usuario.type(screen.getByLabelText("Contraseña"), "clave-segura");
    await usuario.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(screen.getByRole("button", { name: "Ingresando…" })).toBeDisabled();
    expect(ingresarMock).toHaveBeenCalledWith("admin@seanstore.com", "clave-segura");

    completarIngreso({ token: "jwt-de-prueba" });
    expect(await screen.findByRole("heading", { name: "Panel de administración" })).toBeInTheDocument();
  });

  it("muestra un error de conexión cuando falla sin respuesta del servidor", async () => {
    ingresarMock.mockRejectedValue(new Error("No pudimos conectar con la tienda."));
    const usuario = userEvent.setup();
    renderIngresar();

    await usuario.type(screen.getByLabelText("Email"), "admin@seanstore.com");
    await usuario.type(screen.getByLabelText("Contraseña"), "clave-segura");
    await usuario.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No pudimos conectar con la tienda, probá en un rato.",
    );
    expect(screen.getByRole("alert")).not.toHaveTextContent("clave-segura");
  });

  it("muestra un error genérico cuando el servidor responde 401", async () => {
    ingresarMock.mockRejectedValue(Object.assign(new Error("Error de autenticación"), { status: 401 }));
    const usuario = userEvent.setup();
    renderIngresar();

    await usuario.type(screen.getByLabelText("Email"), "admin@seanstore.com");
    await usuario.type(screen.getByLabelText("Contraseña"), "clave-segura");
    await usuario.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No pudimos iniciar sesión, probá de nuevo.",
    );
    expect(screen.getByRole("alert")).not.toHaveTextContent("clave-segura");
  });

  it("informa el límite de intentos cuando el servidor responde 429", async () => {
    ingresarMock.mockRejectedValue(Object.assign(new Error("Demasiados intentos"), { status: 429 }));
    const usuario = userEvent.setup();
    renderIngresar();

    await usuario.type(screen.getByLabelText("Email"), "admin@seanstore.com");
    await usuario.type(screen.getByLabelText("Contraseña"), "clave-segura");
    await usuario.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Hiciste muchos intentos. Esperá 15 minutos y probá de nuevo.",
    );
    expect(screen.getByRole("alert")).not.toHaveTextContent("clave-segura");
  });

  it("muestra un error de conexión cuando el servidor responde 503", async () => {
    ingresarMock.mockRejectedValue(Object.assign(new Error("Servicio no disponible"), { status: 503 }));
    const usuario = userEvent.setup();
    renderIngresar();

    await usuario.type(screen.getByLabelText("Email"), "admin@seanstore.com");
    await usuario.type(screen.getByLabelText("Contraseña"), "clave-segura");
    await usuario.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No pudimos conectar con la tienda, probá en un rato.",
    );
  });
});
